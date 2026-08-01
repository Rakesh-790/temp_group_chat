import type { SystemEvent } from "./system-event.types";

export const MessageType = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    FILE: "FILE",
    SYSTEM: "SYSTEM",
} as const;

export type MessageType =
    (typeof MessageType)[keyof typeof MessageType];

export type MessageStatus =
    | "sending"
    | "sent"
    | "delivered"
    | "read";

export interface Attachment {
    url: string;
    key: string;
    fileName: string;
    mimeType: string;
    size: number;
}

export interface ReplyMessage {
    _id: string;
    content: string;
    sender: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

export interface ReadReceipt {
    user: string;
    readAt: string;
}

export interface ApiMessage {
    _id: string;

    group: string;

    sender: {
        _id: string;
        username: string;
        avatar?: string;
    };

    type: MessageType;

    content: string | null;

    systemEvent: SystemEvent | null;

    attachments: Attachment[];

    replyTo: ReplyMessage | null;

    deliveredTo: string[];

    readBy: ReadReceipt[];

    edited: boolean;

    editedAt: string | null;

    deleted: boolean;

    deletedAt: string | null;

    createdAt: string;

    updatedAt: string;
}

export interface MessageAttachment {
    id: string;
    url: string;
    type: "image" | "video" | "file";
    fileName: string;
}

export interface MessageReaction {
    emoji: string;
    count: number;
}

export interface MessageReply {
    id: string;
    senderName: string;
    content: string;
}

export interface Message {
    id: string;

    senderId: string;

    senderName: string;

    senderAvatar?: string;

    type: MessageType;

    content: string;

    systemEvent: SystemEvent | null;

    createdAt: string;

    isMine: boolean;

    status: MessageStatus;

    edited: boolean;

    editedAt?: string;

    replyTo: MessageReply | null;

    attachments: MessageAttachment[];

    reactions: MessageReaction[];
}

export interface GetMessagesResponse {
    messages: ApiMessage[];
    hasNextPage: boolean;
}

export interface MessageDeliveryUpdate {
    messageIds: string[];
    userId: string;
    senderIds: string[];
}

export interface MessageReadUpdate {
    messageIds: string[];
    userId: string;
    readAt: string;
    senderIds: string[];
}