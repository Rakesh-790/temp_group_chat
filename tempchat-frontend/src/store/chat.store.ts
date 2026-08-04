import { create } from "zustand";
import type { Group } from "../types/group.types";

export interface SelectedChat {
    id: string;
    name: string;
}

interface ChatStore {
    selectedChat: Group | null;

    selectChat: (chat: Group) => void;

    updateSelectedChat: (chat: Group) => void;

    clearSelectedChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    selectedChat: null,

    selectChat: (chat) =>
        set({
            selectedChat: chat,
        }),

    updateSelectedChat: (chat) =>
    set({
        selectedChat: chat,
    }),

    clearSelectedChat: () =>
        set({
            selectedChat: null,
        }),
}));