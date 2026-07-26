import { useQueryClient } from "@tanstack/react-query";
import { Check, EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SortType } from "../layout/Sidebar";

interface SidebarHeaderProps {
    sort: SortType;
    setSort: React.Dispatch<React.SetStateAction<SortType>>;
};

const SidebarHeader = ({
    sort,
    setSort,
}: SidebarHeaderProps) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const handleRefreshGroups = async () => {
        setIsMenuOpen(false);

        await queryClient.invalidateQueries({
            queryKey: ["groups"],
        });
    };

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

    return (
        <header className="flex h-16 items-center justify-between border-b border-[#2a3942] bg-[#202c33] px-4">
            <div>
                <h1 className="text-lg font-semibold text-white">
                    Chats
                </h1>
            </div>

            <div
                ref={menuRef}
                className="relative"
            >
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="rounded-lg p-2 text-[#eff2f4] transition hover:bg-[#2a3942] hover:text-white"
                >
                    <EllipsisVertical size={20} />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 mt-3 w-52 rounded-lg border border-[#2a3942] bg-[#202c33] text-[#e9edef] shadow-lg">
                        <button className="w-full px-4 py-3 text-left transition hover:bg-[#2a3942]" onClick={handleRefreshGroups}>
                            Refresh Groups
                        </button>

                        <div className="border-t border-[#2a3942]" />

                        <div className="px-4 py-2 text-xs uppercase tracking-wide text-[#8696a0]">
                            Sort
                        </div>

                        <button
                            onClick={() => {
                                setSort("newest");
                                setIsMenuOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#2a3942]"
                        >
                            <span>Newest</span>

                            {sort === "newest" && (
                                <Check size={16} />
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setSort("oldest");
                                setIsMenuOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#2a3942]"
                        >
                            <span>Oldest</span>

                            {sort === "oldest" && (
                                <Check size={16} />
                            )}
                        </button>

                        <button
                            onClick={() => {
                                setSort("alphabetical");
                                setIsMenuOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#2a3942]"
                        >
                            <span>A–Z</span>

                            {sort === "alphabetical" && (
                                <Check size={16} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default SidebarHeader;