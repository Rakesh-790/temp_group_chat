import { socketManager } from "../../socket/socket.manager";
import { getGroupMemberIds } from "../groups/group.service";
import { markPendingMessagesAsDelivered } from "../messages/message.service";
import { markUserOffline, markUserOnline } from "../users/user.service";

export const handleUserConnected = async (
    userId: string
): Promise<void> => {

    if (socketManager.getSocketCount(userId) !== 1) {
        return;
    }

    await markUserOnline(userId);

    const deliveryUpdates = await markPendingMessagesAsDelivered(userId);

    for (const update of deliveryUpdates) {

        socketManager.emitToUser(
            update.senderIds[0],
            "message:delivery:update",
            update
        );

    }

    const recipientIds = await getGroupMemberIds(userId);

    for (const recipientId of recipientIds) {
        socketManager.emitToUser(
            recipientId,
            "user:online",
            {
                userId
            }
        );
    }
};

export const handleUserDisconnected = async (
    userId: string
): Promise<void> => {

    if (socketManager.getSocketCount(userId) > 0) {
        return;
    }

    const user = await markUserOffline(userId);

    const recipientIds = await getGroupMemberIds(userId);

    for (const recipientId of recipientIds) {
        socketManager.emitToUser(
            recipientId,
            "user:offline",
            {
                userId,
                lastSeen: user.lastSeen
            }
        );
    }
};