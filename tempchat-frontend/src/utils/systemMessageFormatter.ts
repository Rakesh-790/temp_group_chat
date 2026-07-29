import type { GroupMember } from "../types/group.types";
import type { Message } from "../types/message.types";


export const formatSystemMessage = (
    message: Message,
    members: GroupMember[]
): string => {
    if (!message.systemEvent) {
        return "";
    }

    switch (message.systemEvent.action) {
        case "ROLE_CHANGED": {
            const {
                targetUserId,
                previousRole,
                newRole,
            } = message.systemEvent.metadata;

            const targetMember = members.find(
                member => member.user._id === targetUserId
            );

            const targetName =
                targetMember?.user.username ?? "Unknown User";

            const action =
                previousRole === "MEMBER"
                    ? "promoted to"
                    : "demoted to";

            return `${targetName} was ${action} ${newRole.toLowerCase()} by ${message.senderName}`;
        }

        default:
            return "";
    }
};