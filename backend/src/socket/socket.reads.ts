import { Server, Socket } from "socket.io";
import { socketEvent } from "./socket.wrapper";
import { markMessageReadSchema } from "../modules/messages/message.validation";
import { markMessageAsRead } from "../modules/messages/message.service";

export const registerReadHandlers = (
    io: Server,
    socket: Socket
): void => {

    socket.on(
        "message:read",
        socketEvent(socket, async (payload, callback) => {

            const data = markMessageReadSchema.parse(payload);

            console.log("message:read event received");
            console.log(data);

            const userId = socket.data.user.id;

            const result = await markMessageAsRead({
                groupId: data.groupId,
                messageIds: data.messageIds,
                userId
            });

            io.to(data.groupId).emit(
                "message:read:update",
                result
            );

            callback?.({
                success: true,
                message: "Messages marked as read successfully"
            });
        })
    );
};