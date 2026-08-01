import { Socket } from "socket.io";
import { socketEvent } from "./socket.wrapper";
import { markMessageDeliveredSchema } from "../modules/messages/message.validation";
import { markMessageAsDelivered } from "../modules/messages/message.service";
import { socketManager } from "./socket.manager";

export const registerDeliveryHandlers = (
    socket: Socket
): void => {

    socket.on(
        "message:delivered",
        socketEvent(socket, async (payload, callback) => {

            const data = markMessageDeliveredSchema.parse(payload);

            const userId = socket.data.user.id;

            const result = await markMessageAsDelivered({
                groupId: data.groupId,
                messageIds: data.messageIds,
                userId,
            });

            for (const senderId of result.senderIds) {

                socketManager.emitToUser(
                    senderId,
                    "message:delivery:update",
                    result
                );

            }

            callback?.({
                success: true,
                message: "Messages marked as delivered successfully.",
            });

        })
    );

};