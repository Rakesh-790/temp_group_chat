import { Types } from "mongoose";
import { MessageType } from "./message.model";

export interface CreateMessageInput {
    groupId: string;
    senderId: string;
    type: MessageType;
    content?: string;
    attachments?: MessageAttachment[];
    replyTo?: string;
}

export interface MessageAttachment {
    url: string;
    key: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export interface ReadReceipt {
    user: Types.ObjectId;
    readAt: Date;
}

export interface SendMessagePayload {
    groupId: string;
    type: MessageType;
    content?: string;
    attachments?: MessageAttachment[];
    replyTo?: string;
}

export interface MessageResponse {
    _id: Types.ObjectId;
    group: Types.ObjectId;
    sender: Types.ObjectId;
    type: MessageType;
    content: string | null;
    attachments: MessageAttachment[];
    replyTo: Types.ObjectId | null;
    deliveredTo: Types.ObjectId[];
    readBy: ReadReceipt[];
    edited: boolean;
    editedAt: Date | null;
    deleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}