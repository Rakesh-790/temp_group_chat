import { MoreVertical } from "lucide-react";
import type { Group } from "../../../types/group.types";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import GroupInfoModal from "../../group/GroupInfoModal";
import DeleteGroupModal from "../../group/DeleteGroupModal";

interface ChatHeaderProps {
    chat: Group;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const user = useAuthStore((state) => state.user);

    const isOwner = chat.owner._id === user?.id;

    const memberNames = chat.members
        .map((member) => member.user.username)
        .join(", ");

    return (
        <>
            <header className="flex h-16 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#54656f] font-semibold text-white">
                        {chat.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2 className="font-medium text-white">
                            {chat.name}
                        </h2>

                        {memberNames ? (
                            <p className="truncate text-xs text-[#8696a0]">
                                {memberNames}
                            </p>
                        ) : (
                            <div className="mt-1 h-3 w-36 animate-pulse rounded bg-[#2a3942]" />
                        )}
                    </div>
                </div>

                <div
                    ref={menuRef}
                    className="relative"
                >
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="rounded-lg p-2 text-[#8696a0] transition hover:bg-[#2a3942] hover:text-white"
                    >
                        <MoreVertical size={20} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-3 w-52 rounded-lg border border-[#2a3942] bg-[#202c33] shadow-lg">

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setIsGroupInfoOpen(true);
                                }}
                                className="w-full px-4 py-3 text-left text-white transition hover:bg-[#2a3942]"
                            >
                                Group Info
                            </button>

                            {isOwner && (
                                <>
                                    <div className="mx-2 border-t border-[#2a3942]" />

                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="w-full px-4 py-3 text-left text-red-400 transition hover:bg-[#2a3942]"
                                    >
                                        Delete Group
                                    </button>
                                </>
                            )}

                        </div>
                    )}
                </div>
            </header>

            <GroupInfoModal
                isOpen={isGroupInfoOpen}
                onClose={() => setIsGroupInfoOpen(false)}
                group={chat}
            />

            <DeleteGroupModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                group={chat}
            />
        </>
    );
};

export default ChatHeader;