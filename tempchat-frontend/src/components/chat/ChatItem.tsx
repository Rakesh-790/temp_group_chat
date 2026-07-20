import { useChatStore } from "../../store/chat.store";
import type { Chat } from "../../types/chat.types";


interface ChatItemProps {
    chat: Chat;
}

const ChatItem = ({ chat }: ChatItemProps) => {
    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    const selectChat = useChatStore(
        (state) => state.selectChat
    );

    const isSelected = selectedChat?.id === chat.id;

    return (
        <button
            onClick={() => selectChat({id: chat.id, name: chat.name})}
            className={`flex w-full items-center gap-3 border-b border-[#202c33] px-4 py-3 text-left transition ${
                isSelected
                    ? "bg-[#2a3942]"
                    : "hover:bg-[#202c33]"
            }`}
        >
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#54656f] font-semibold text-white">
                {chat.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                    <h3 className="truncate font-medium text-white">
                        {chat.name}
                    </h3>

                    <span className="text-xs text-[#8696a0]">
                        {chat.time}
                    </span>
                </div>

                <div className="mt-1 flex justify-between">
                    <p className="truncate text-sm text-[#8696a0]">
                        {chat.lastMessage}
                    </p>

                    {chat.unreadCount > 0 && (
                        <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#00a884] px-1 text-xs text-white">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatItem;