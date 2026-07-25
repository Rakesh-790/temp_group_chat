import { create } from "zustand";

type Panel = "chats" | "profile";

interface UIStore {
    activePanel: Panel;
    setActivePanel: (panel: Panel) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    activePanel: "chats",

    setActivePanel: (panel) =>
        set({
            activePanel: panel,
        }),
}));