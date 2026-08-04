import crypto from 'crypto';
import groupModel from './group.model';
import { AppError } from '../../utils/AppError';
import mongoose from 'mongoose';
import { addDeleteGroupJob } from '../../jobs/queues/deleteGroup.queues';
import { Message, SystemAction } from '../messages/message.model';
import { createSystemMessage } from '../messages/system-message.service';
import { ensureGroupManager, ensureGroupOwner, ensureUserIsNotMember } from './group.permission';
import { deleteImageFromS3, uploadImageToS3 } from '../../utils/s3.utils';

interface CreateGroupData {
    name: string,
    description?: string,
    duration: number;
    ownerId: string;
};

interface UpdateGroupData {
    name?: string;
    description?: string;
};

//helper function to get populated group with owner and members
const getPopulatedGroup = async (
    groupId: string
) => {
    return groupModel
        .findById(groupId)
        .populate(
            "owner",
            "username avatar bio isOnline lastSeen"
        )
        .populate(
            "members.user",
            "username avatar bio isOnline lastSeen"
        );
};

export const createGroup = async (
    data: CreateGroupData
) => {
    const {
        name,
        description,
        duration,
        ownerId
    } = data;

    const expiresAt = new Date(
        Date.now() + duration * 60 * 60 * 1000
    );

    const inviteCode = `tempchat-${crypto.randomBytes(4).toString('hex')}`;

    const group = await groupModel.create({
        name,
        description,
        owner: ownerId,
        members: [
            {
                user: ownerId,
                role: 'OWNER'
            }
        ],
        inviteCode,
        expiresAt
    });

    await addDeleteGroupJob(
        group._id.toString(),
        group.expiresAt
    )

    await group.populate('owner', 'username');

    return {
        id: group.id,
        name: group.name,
        owner: group.owner,
        inviteCode: group.inviteCode,
        expiresAt: group.expiresAt
    };
};

export const joinGroup = async (
    inviteCode: string,
    userId: string
) => {

    const group = await groupModel.findOne({
        inviteCode
    });

    if (!group) {
        throw new AppError(
            'Group not Found',
            404
        );
    };

    if (group.isDeleted) {
        throw new AppError(
            'Group has been deleted',
            400
        );
    };

    if (group.expiresAt < new Date()) {
        throw new AppError(
            'Group has expired',
            400
        );
    };

    ensureUserIsNotMember(group, userId);

    group.members.push({
        user: userId as any,
        role: 'MEMBER',
        joinedAt: new Date()
    });

    await group.save();

    return {
        id: group.id,
        name: group.name,
        expiresAt: group.expiresAt
    };
};

export const assignRole = async (
    groupId: string,
    requesterId: string,
    targetUserId: string,
    role: 'OWNER' | 'ADMIN' | 'MEMBER'
) => {

    const group = await groupModel
        .findById(groupId)
        .select({
            owner: 1,
            members: 1,
            expiresAt: 1,
            isDeleted: 1,
        });

    if (!group) {
        throw new AppError(
            'Group not found',
            404
        );
    };

    if (group.isDeleted) {
        throw new AppError(
            'Group has been deleted',
            400
        );

    };

    if (group.expiresAt < new Date()) {
        throw new AppError(
            'Group has expired',
            400
        );
    }

    ensureGroupOwner(group, requesterId);

    if (role === 'OWNER') {
        throw new AppError(
            'Owner role cannot be assigned. Transfer ownership instead.',
            400
        );

    };

    const member = group.members.find(
        member => member.user.toString() === targetUserId
    );

    if (!member) {
        throw new AppError(
            'User is not a member',
            404
        );
    };

    if (member.role === 'OWNER') {
        throw new AppError(
            'Owner role cannot be modified',
            400
        );
    };

    if (member.role === role) {

        throw new AppError(
            `User is already ${role}`,
            400
        );

    };

    const previousRole = member.role;

    const result = await groupModel.updateOne(
        {
            _id: groupId,
            "members.user": targetUserId,
        },
        {
            $set: {
                "members.$.role": role,
            },
        }
    );

    if (result.matchedCount === 0) {
        throw new AppError(
            "Failed to update member role",
            409
        );
    };

    const systemMessage = await createSystemMessage({
        groupId,
        senderId: requesterId,
        event: {
            action: SystemAction.ROLE_CHANGED,
            metadata: {
                targetUserId,
                previousRole,
                newRole: role,
            },
        },
    });

    const updatedGroup = await getPopulatedGroup(groupId);

    return {
        groupId,
        targetUserId,
        requesterId,
        previousRole,
        newRole: role,
        systemMessage,
        group: updatedGroup
    };
};

export const updateGroup = async (
    groupId: string,
    requesterId: string,
    data: UpdateGroupData
) => {

    const group = await groupModel.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found",
            404
        );
    }

    if (group.isDeleted) {
        throw new AppError(
            "Group has been deleted",
            400
        );
    }

    if (group.expiresAt < new Date()) {
        throw new AppError(
            "Group has expired",
            400
        );
    }

    ensureGroupManager(group, requesterId);

    const previousName = group.name;
    const previousDescription = group.description ?? null;

    if (data.name !== undefined) {
        group.name = data.name;
    }

    if (data.description !== undefined) {
        group.description = data.description;
    }

    await group.save();

    const systemMessages = [];

    if (
        data.name !== undefined &&
        previousName !== group.name
    ) {

        const systemMessage = await createSystemMessage({
            groupId,
            senderId: requesterId,
            event: {
                action: SystemAction.GROUP_RENAMED,
                metadata: {
                    oldName: previousName,
                    newName: group.name,
                },
            },
        });

        systemMessages.push(systemMessage);
    }

    if (
        data.description !== undefined &&
        previousDescription !== group.description
    ) {

        const systemMessage = await createSystemMessage({
            groupId,
            senderId: requesterId,
            event: {
                action: SystemAction.GROUP_DESCRIPTION_UPDATED,
                metadata: {
                    oldDescription: previousDescription,
                    newDescription: group.description ?? null,
                },
            },
        });

        systemMessages.push(systemMessage);
    }

    const updatedGroup = await getPopulatedGroup(group.id);

    return {
        group: updatedGroup,
        systemMessages,
    };
};

export const updateGroupAvatar = async (
    groupId: string,
    requesterId: string,
    file: Express.Multer.File
) => {

    if (!file) {
        throw new AppError(
            "Avatar is required",
            400
        );
    }

    const group = await groupModel.findById(groupId);

    if (!group) {
        throw new AppError(
            "Group not found",
            404
        );
    }

    if (group.isDeleted) {
        throw new AppError(
            "Group has been deleted",
            400
        );
    }

    if (group.expiresAt < new Date()) {
        throw new AppError(
            "Group has expired",
            400
        );
    }

    ensureGroupManager(group, requesterId);

    const oldAvatarKey = group.avatar?.key;

    const uploadedAvatar = await uploadImageToS3({
        file,
        folder: "groups",
        identifier: group.id,
    });

    group.avatar = {
        key: uploadedAvatar.key,
        url: uploadedAvatar.url,
    };

    await group.save();

    if (oldAvatarKey) {
        try {
            await deleteImageFromS3(oldAvatarKey);
        } catch (error) {
            console.error(
                "Failed to delete old group avatar",
                error
            );
        }
    }

    const systemMessage = await createSystemMessage({
        groupId,
        senderId: requesterId,
        event: {
            action: SystemAction.GROUP_AVATAR_CHANGED,
            metadata: {},
        },
    });

    const updatedGroup = await getPopulatedGroup(group.id);

    return {
        group: updatedGroup,
        systemMessage,
    };
};

export const softDeleteGroup = async (
    groupId: string,
    requesterId: string
) => {

    const group = await groupModel.findById(groupId);

    if (!group) {
        throw new AppError(
            'Group not found',
            404
        );
    };

    if (group.isDeleted) {
        throw new AppError(
            'Group already deleted',
            400
        );
    };

    if (group.expiresAt < new Date()) {
        throw new AppError(
            'Group is already expired',
            400
        );
    };

    ensureGroupOwner(group, requesterId);

    group.isDeleted = true;

    group.deletedAt = new Date();

    await group.save();

    const deleteAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await addDeleteGroupJob(
        group.id,
        deleteAt
    );

    return {
        groupId: group.id,
        name: group.name,
        deletedAt: group.deletedAt
    };
};

export const getGroupById = async (groupId: string) => {

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        throw new AppError('Invalid group id', 400);
    }

    const group = await getPopulatedGroup(groupId);

    if (!group) {
        throw new AppError('Group not found', 404);
    }

    return group;
};

export const getAllGroups = async (
    userId: string,
    page: number = 1,
    limit: number = 5
) => {

    const skip = (page - 1) * limit;

    const filter = {
        "members.user": userId,
        isDeleted: false,
        expiresAt: { $gt: new Date() }
    };

    const groups = await groupModel
        .find(filter)
        .populate("owner", "username avatar bio isOnline lastSeen")
        .populate("members.user", "username avatar bio isOnline lastSeen")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const groupWithLastMessage = await Promise.all(
        groups.map(async (group) => {
            const lastMessage = await Message.findOne({
                group: group._id,
                deleted: false
            })
                .sort({ createdAt: -1 })
                .populate("sender", "username");

            return {
                ...group.toObject(),
                lastMessage
            };
        })
    );

    const totalGroups = await groupModel.countDocuments(filter);

    return {
        groups: groupWithLastMessage,
        totalGroups: totalGroups,
        hasNextPage: page * limit < totalGroups,
        hasPreviousPage: page > 1
    };
};

export const deleteExpiredGroup = async (
    groupId: string
) => {

    const group = await groupModel.findById(groupId);

    if (!group) {
        return;
    }

    await Message.deleteMany({
        group: group._id,
    });

    await group.deleteOne();

    console.log(`Group with ${groupId} deleted successfully.`);
};

export const getGroupMemberIds = async (
    userId: string
): Promise<string[]> => {

    const groups = await groupModel
        .find({
            "members.user": userId,
            isDeleted: false,
            expiresAt: {
                $gt: new Date()
            }
        })
        .select("members.user")
        .lean();

    const memberIds = new Set<string>();

    for (const group of groups) {
        for (const member of group.members) {
            const memberId = member.user.toString();

            memberIds.add(memberId);
        }
    }

    return Array.from(memberIds);
};