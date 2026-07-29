import { InferSchemaType, model, Schema, Types } from "mongoose";

export enum MessageType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FILE = "FILE",
    SYSTEM = "SYSTEM"
};

export enum SystemAction {
    ROLE_CHANGED = "ROLE_CHANGED",

    MEMBER_JOINED = "MEMBER_JOINED",

    MEMBER_LEFT = "MEMBER_LEFT",

    MEMBER_REMOVED = "MEMBER_REMOVED",

    GROUP_CREATED = "GROUP_CREATED",

    GROUP_RENAMED = "GROUP_RENAMED",

    GROUP_DESCRIPTION_UPDATED = "GROUP_DESCRIPTION_UPDATED",

    OWNER_TRANSFERRED = "OWNER_TRANSFERRED",

    GROUP_EXPIRED = "GROUP_EXPIRED",

    GROUP_DELETED = "GROUP_DELETED",
};

const attachmentSchema = new Schema(
    {
        url: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        mimeType: {
            type: String,
            required: true
        },
        size: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const readReceiptSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        _id: false
    }
);

const systemEventSchema = new Schema(
    {
        action: {
            type: String,
            enum: Object.values(SystemAction),
            required: true,
        },

        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        _id: false,
    }
);

const messageSchema = new Schema(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "group",
            required: true,
            index: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: Object.values(MessageType),
            default: MessageType.TEXT
        },
        content: {
            type: String,
            trim: true,
            default: null
        },
        systemEvent: {
            type: systemEventSchema,
            default: null,
        },
        attachments: {
            type: [attachmentSchema],
            default: []
        },
        replyTo: {
            type: Schema.Types.ObjectId,
            ref: "message",
            default: null
        },
        deliveredTo: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "user"
                }
            ],
            default: []
        },
        readBy: {
            type: [readReceiptSchema],
            default: []
        },

        edited: {
            type: Boolean,
            default: false
        },

        editedAt: {
            type: Date,
            default: null
        },

        deleted: {
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

messageSchema.index({ group: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });

export type IMessage = InferSchemaType<typeof messageSchema> & {
    _id: Types.ObjectId;
};

export const Message = model<IMessage>("message", messageSchema);