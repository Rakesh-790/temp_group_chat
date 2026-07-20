import type { Message } from "../types/message.types";

export const messages: Message[] = [
    {
        id: "1",
        senderId: "me",
        senderName: "Rocky",
        content: "Hello 👋",
        createdAt: "10:30 AM",
        isMine: true,
        status: "read",
    },
    {
        id: "2",
        senderId: "user2",
        senderName: "John",
        content: "Hi Rocky!",
        createdAt: "10:31 AM",
        isMine: false,
        status: "read",
    },
    {
        id: "3",
        senderId: "me",
        senderName: "Rocky",
        content: "TempChat is looking great.",
        createdAt: "10:32 AM",
        isMine: true,
        status: "delivered",
    },
];