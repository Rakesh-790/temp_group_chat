import { create } from "zustand";

export interface SelectedChat {
    id: string;
    name: string;
}

interface ChatStore {
    selectedChat: SelectedChat | null;

    selectChat: (chat: SelectedChat) => void;

    clearSelectedChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    selectedChat: null,

    selectChat: (chat) =>
        set({
            selectedChat: chat,
        }),

    clearSelectedChat: () =>
        set({
            selectedChat: null,
        }),
}));