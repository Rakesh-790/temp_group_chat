import type { Chat } from "../../types/chat.types";

export const chats: Chat[] = [
    {
        id: "1",
        name: "React Developers",
        lastMessage: "Socket.IO is working.",
        time: "10:30",
        unreadCount: 3,
    },
    {
        id: "2",
        name: "Backend Team",
        lastMessage: "Redis cache fixed.",
        time: "Yesterday",
        unreadCount: 0,
    },
    {
        id: "3",
        name: "College Friends",
        lastMessage: "Let's meet tomorrow.",
        time: "8:15 PM",
        unreadCount: 1,
    },
];