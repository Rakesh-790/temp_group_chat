import { useChatStore } from "../../store/chat.store";
import type { Group } from "../../types/group.types";


interface ChatItemProps {
    group: Group;
}

const ChatItem = ({ group }: ChatItemProps) => {
    const selectedChat = useChatStore(
        (state) => state.selectedChat
    );

    const selectChat = useChatStore(
        (state) => state.selectChat
    );

    const isSelected = selectedChat?._id === group._id;

    return (
        <button
            onClick={() => selectChat(group)}
            className={`flex w-full items-center gap-3 border-b border-[#202c33] px-4 py-3 text-left transition ${isSelected
                ? "bg-[#2a3942]"
                : "hover:bg-[#202c33]"
                }`}
        >
            {/* Avatar */}
            {group.avatar?.url ? (
                <div className="h-12 w-12 overflow-hidden rounded-full">
                    <img
                        src={group.avatar.url}
                        alt={group.name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#54656f] font-semibold text-white">
                    {group.name.charAt(0).toUpperCase()}
                </div>
            )}

            <div className="min-w-0 flex-1">
                <div className="flex justify-between">
                    <h3 className="truncate font-medium text-white">
                        {group.name}
                    </h3>

                    <span className="text-xs text-[#8696a0]">
                        {/* time */}
                    </span>
                </div>

                <div className="mt-1 flex justify-between">
                    <p className="truncate text-sm text-[#8696a0]">
                        {group.lastMessage ? (
                            <>
                                {group.lastMessage.sender.username}:{" "}
                                {group.lastMessage.content}
                            </>
                        ) : (
                            "No message yet"
                        )}
                    </p>
                </div>
            </div>
        </button>
    );
};

export default ChatItem;