import crypto from 'crypto';
import groupModel from './group.model';

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

