import { Socket } from "socket.io";
import { socketEvent } from "./socket.wrapper";
import { markMessageDeliveredSchema } from "../modules/messages/message.validation";
import { markMessageAsDelivered } from "../modules/messages/message.service";
import { success } from "zod";
import { socketManager } from "./socket.manager";

export const registerDeliveryHandlers = (
    socket: Socket
): void => {

    socket.on(
        "message:delivered",
        socketEvent(socket, async(payload, callback) => {

            const data = markMessageDeliveredSchema.parse(payload);

            const userId = socket.data.user.id;

            const result = await markMessageAsDelivered({
                groupId: data.groupId,
                messageIds: data.messageIds,
                userId
            });

            if (result.senderIds.length === 0) {
                callback?.({
                    success: false,
                    message: "No new messages were marked as delivered."
                });

                return;
            };

            for(const senderId of result.senderIds){
                socketManager.emitToUser(
                    senderId,
                    "message:delivery:update",
                    result
                );
            };

            callback?.({
                success: true,
                message: "Message marked as delivered successfully."
            });
        })
    );
};