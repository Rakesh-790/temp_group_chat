import crypto from 'crypto';
import groupModel, { IGroup } from './group.model';
import { AppError } from '../../utils/AppError';
import mongoose from 'mongoose';
import { addDeleteGroupJob } from '../../jobs/queues/deleteGroup.queues';

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

    const group = await groupModel.findById(groupId);

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

    member.role = role;

    await group.save();

    return {
        groupId: group.id,
        userId: targetUserId,
        role
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

    const group = await groupModel.findById(groupId);

    if (!group) {
        throw new AppError('Group not found', 404);
    }

    return group;
};

export const getAllGroups = async (
    page: number = 1,
    limit: number = 5
) => {

    const skip = (page - 1) * limit;

    const groups = await groupModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const totalGroups = await groupModel.countDocuments();

    return {
        groups,
        totalGroups: totalGroups,
        hashNextPage: page * limit < totalGroups,
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

    await group.deleteOne();

    console.log(`Group with ${groupId} deleted successfully.`);
};

export const ensureUserIsMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        member => member.user.toString() === userId
    );

    if (!isMember) {
        throw new AppError(
            "User is not a member of this group",
            403
        );
    };
};

export const ensureUserIsNotMember = (
    group: IGroup,
    userId: string
): void => {

    const isMember = group.members.some(
        member => member.user.toString() === userId
    );

    if (isMember) {
        throw new AppError(
            "Already a member of this group",
            400
        );
    }

};