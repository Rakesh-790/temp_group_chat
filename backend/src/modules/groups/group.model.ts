import mongoose, { Document, Types } from "mongoose";

export interface IGroupMember {
    user: Types.ObjectId;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
    joinedAt: Date;
};

interface IGroupAvatar{
    url: string | null;
    key: string | null;
}

export interface IGroup extends Document {
    name: string;

    description?: string;

    owner: Types.ObjectId;

    members: IGroupMember[];

    avatar: IGroupAvatar;

    inviteCode: string;

    expiresAt: Date;

    isDeleted: boolean;

    deletedAt: Date | null;

    createdAt: Date;

    updatedAt: Date;
};

const memberSchema = new mongoose.Schema<IGroupMember>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        role: {
            type: String,
            enum: ['OWNER', 'ADMIN', 'MEMBER'],
            default: 'MEMBER'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const groupSchema = new mongoose.Schema<IGroup>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        members: [memberSchema],

        avatar: {
            url: {
                type: String,
                default: null
            },
            key: {
                type: String,
                default: null
            }
        },
        
        inviteCode: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const groupModel = mongoose.model<IGroup>('group', groupSchema);

export default groupModel;