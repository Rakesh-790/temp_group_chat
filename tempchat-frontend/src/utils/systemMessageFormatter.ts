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

        case "MEMBER_JOINED": {

            const {
                userId,
            } = message.systemEvent.metadata;

            const joinedMember = members.find(
                member => member.user._id === userId
            );

            const joinedName =
                joinedMember?.user.username ?? "Unknown User";

            return `${joinedName} joined the group.`;
        }

        case "MEMBER_REMOVED": {

            const {
                targetUsername,
            } = message.systemEvent.metadata;

            return `${targetUsername} was removed by ${message.senderName}.`;
        }

        case "GROUP_RENAMED": {

            const {
                oldName,
                newName,
            } = message.systemEvent.metadata;

            return `${message.senderName} changed the group name from "${oldName}" to "${newName}".`;
        }

        case "GROUP_DESCRIPTION_UPDATED": {

            return `${message.senderName} updated the group description.`;
        }

        case "GROUP_AVATAR_CHANGED": {

            return `${message.senderName} changed the group photo.`;
        }

        default:
            return "";
    }

};