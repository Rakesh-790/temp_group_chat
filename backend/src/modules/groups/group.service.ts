import crypto from 'crypto';
import groupModel from './group.model';
import { AppError } from '../../utils/AppError';

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

    await group.populate('owner', 'username');

    return {
        id: group.id,
        name: group.name,
        owner: group.owner,
        inviteCode: group.inviteCode,
        expiresAt: group.expiresAt
    };
};

export const joinGroup = async(
    inviteCode: string,
    userId: string
) => {

    const group = await groupModel.findOne({
        inviteCode
    });

    if(!group){
        throw new AppError(
            'Group not Found',
            404
        );
    };

    if(group.isDeleted){
        throw new AppError(
            'Group has been deleted',
            400
        );
    };

    if(group.expiresAt < new Date()){
        throw new AppError(
            'Group has expired',
            400
        );
    };

    const isMember =  group.members.some(
        memeber => memeber.user.toString() === userId
    );

    if (isMember) {
        throw new AppError(
            'Already a member of this group',
            400
        );
    };

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

export const assignRole = async(
    groupId: string,
    requesterId : string,
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

    if(group.isDeleted){
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

    if(!member){
        throw new AppError(
            'User is not a member',
            404
        );
    };

    if(member.role === 'OWNER'){
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
