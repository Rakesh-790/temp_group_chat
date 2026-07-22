export const MessageType = {
    TEXT: "TEXT",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    FILE: "FILE",
    SYSTEM: "SYSTEM",
} as const;

export type MessageType =
    (typeof MessageType)[keyof typeof MessageType];

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

export interface Message {
    id: string;

    senderId: string;

    senderName: string;

    senderAvatar?: string;

    type: MessageType;

    content: string;

    createdAt: string;

    isMine: boolean;

    status: "sending" | "sent" | "delivered" | "read";

    edited: boolean;

    editedAt?: string;

    replyTo?: {
        id: string;
        senderName: string;
        content: string;
    } | null;

    attachments?: {
        id: string;
        url: string;
        type: "image" | "video" | "file";
        fileName: string;
    }[];

    reactions?: {
        emoji: string;
        count: number;
    }[];
}

export interface GetMessagesResponse {
    messages: ApiMessage[];
    hasNextPage: boolean;
}