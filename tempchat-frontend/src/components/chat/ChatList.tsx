import { useGroups } from "../../hooks/useGroups";
import type { SortType } from "../layout/Sidebar";
import ChatItem from "./ChatItem";

interface ChatListProps {
    search: string;
    sort: SortType;
};

const ChatList = ({ search, sort }: ChatListProps) => {
    const { data: groups, isPending, error } = useGroups();

    if (isPending) {
        return (
            <div className="p-4 text-center text-gray-400">
                Loading groups...
            </div>
        );
    };

    if (error) {
        return (
            <div className="p-4 text-center text-red-400">
                Failed to load groups.
            </div>
        );
    };

    const filteredGroups =
        groups?.filter((group) =>
            group.name
                .toLowerCase()
                .includes(search.toLowerCase())
        ) ?? [];

    const sortedGroups = [...filteredGroups];

    if (sort === "newest") {
        sortedGroups.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    };

    if (sort === "oldest") {
        sortedGroups.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
    };

    if (sort === "alphabetical") {
        sortedGroups.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    };

    if (filteredGroups.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <h3 className="text-base font-medium text-white">
                    No groups found
                </h3>

                {search && (
                    <p className="text-sm text-[#8696a0]">
                        No results for <span className="text-white">"{search}"</span>
                    </p>
                )}
            </div>
        );
    };

    return (
        <>
            {sortedGroups.map((group) => (
                <ChatItem
                    key={group._id}
                    group={group}
                />
            ))}
        </>
    );
};

export default ChatList;