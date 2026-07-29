import crypto from 'crypto';
import groupModel, { IGroup, IGroupMember } from './group.model';
import { AppError } from '../../utils/AppError';
import mongoose, { Types } from 'mongoose';
import { addDeleteGroupJob } from '../../jobs/queues/deleteGroup.queues';
import { Message, SystemAction } from '../messages/message.model';
import { createSystemMessage } from '../messages/system-message.service';

interface CreateGroupData {
    name: string,
    description?: string,
    duration: number;
    ownerId: string;
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

    if (group.owner.toString() !== requesterId) {
        throw new AppError(
            'Only Owner can assign roles',
            403
        );
    };

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

    const updatedGroup = await groupModel
    .findById(groupId)
    .populate("owner", "username avatar bio")
    .populate("members.user", "username avatar bio");

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

    if (group.owner.toString() !== requesterId) {
        throw new AppError(
            'Only Owner can delete the group',
            403
        );
    };

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

    const group = await groupModel
        .findById(groupId)
        .populate(
            "owner",
            "avatar username bio"
        )
        .populate(
            "members.user",
            "username avatar bio"
        );

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
        .populate("owner", "username avatar bio")
        .populate("members.user", "username avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalGroups = await groupModel.countDocuments(filter);

    return {
        groups,
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

export const ensureUserIsMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        (member) => getMemberUserId(member) === userId
    );

    if (!isMember) {
        throw new AppError(
            "User is not a member of this group",
            403
        );
    }
};

export const ensureUserIsNotMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        (member) => getMemberUserId(member) === userId
    );

    if (isMember) {
        throw new AppError(
            "Already a member of this group",
            400
        );
    }
};

// Helper function.
const getMemberUserId = (member: IGroupMember): string => {
    const user = member.user as any;

    return user._id
        ? user._id.toString()
        : user.toString();
};