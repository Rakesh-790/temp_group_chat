import { MoreVertical } from "lucide-react";

interface ChatHeaderProps {
    chat: {
        id: string;
        name: string;
    };
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#54656f] font-semibold text-white">
                    {chat.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2 className="font-medium text-white">
                        {chat.name}
                    </h2>

                    <p className="text-xs text-[#8696a0]">
                        Loading...
                    </p>
                </div>
            </div>

            <button className="rounded-lg p-2 text-[#8696a0] transition hover:bg-[#2a3942] hover:text-white">
                <MoreVertical size={20} />
            </button>
        </header>
    );
};

export default ChatHeader;