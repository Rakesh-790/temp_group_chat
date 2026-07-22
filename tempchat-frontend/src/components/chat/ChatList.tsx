import { useGroups } from "../../hooks/useGroups";
import ChatItem from "./ChatItem";

const ChatList = () => {
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

    return (
        <div className="flex-1 overflow-y-auto">
            {groups?.map((group) => (
                <ChatItem
                    key={group._id}
                    group={group}
                />
            ))}
        </div>
    );
};

export default ChatList;