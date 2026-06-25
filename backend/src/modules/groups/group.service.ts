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
