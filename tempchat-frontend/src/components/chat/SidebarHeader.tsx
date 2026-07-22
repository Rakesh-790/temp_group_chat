import { EllipsisVertical } from "lucide-react";

const SidebarHeader = () => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-4">
            <div>
                <h1 className="text-lg font-semibold text-white">
                    Chats
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 text-[#aebac1] transition hover:bg-[#2a3942] hover:text-white">
                    <EllipsisVertical size={20} />
                </button>
            </div>
        </header>
    );
};

export default SidebarHeader;