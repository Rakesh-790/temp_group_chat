export interface Message {
    id: string;

    senderId: string;

    senderName: string;

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

export interface ApiMessage {
    _id: string;

    sender: {
        _id: string;
        username: string;
    };

    content: string;

    createdAt: string;

    readBy: {
        user: string;
        readAt: string;
    }[];

    deliveredTo: {
        user: string;
        deliveredAt: string;
    }[];
}

export interface GetMessagesResponse {
    messages: ApiMessage[];
    hasNextPage: boolean;
}