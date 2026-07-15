import { Server, Socket } from "socket.io";
import { socketEvent } from "./socket.wrapper";
import { markMessageReadSchema } from "../modules/messages/message.validation";
import { markMessageAsRead } from "../modules/messages/message.service";
import { socketManager } from "./socket.manager";

export const registerReadHandlers = (
    io: Server,
    socket: Socket
): void => {

    socket.on(
        "message:read",
        socketEvent(socket, async (payload, callback) => {

            const data = markMessageReadSchema.parse(payload);

            const userId = socket.data.user.id;

            const result = await markMessageAsRead({
                groupId: data.groupId,
                messageIds: data.messageIds,
                userId
            });

            // io.to(data.groupId).emit(
            //     "message:read:update",
            //     result
            // );

            if (result.senderIds.length === 0) {
                callback?.({
                    success: false,
                    message: "No new messages were marked as read."
                });
                return;
            };

            for (const senderId of result.senderIds){
                socketManager.emitToUser(
                    senderId,
                    "message:read:update",
                    result
                );
            };

            callback?.({
                success: true,
                message: "Messages marked as read successfully"
            });
        })
    );
};