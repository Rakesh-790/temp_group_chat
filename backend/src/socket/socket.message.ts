import { Server, Socket } from "socket.io";
import { socketEvent } from "./socket.wrapper";
import { sendMessageSchema } from "../modules/messages/message.validation";
import { createMessage } from "../modules/messages/message.service";
import { emitNewMessage } from "./emitter/socket.emitter";

export const registerMessageHandlers = (
    io: Server,
    socket: Socket
): void => {

    socket.on(
        "message:send",
        socketEvent(socket, async (payload, callback) => {

            const data = sendMessageSchema.parse(payload);

            const senderId = socket.data.user.id;

            const message = await createMessage({
                groupId: data.groupId,
                senderId,
                type: data.type,
                content: data.content,
                attachments: data.attachments,
                replyTo: data.replyTo
            });

            emitNewMessage(
                data.groupId,
                message
            );

            callback?.({
                success: true,
                message: "Message sent successfully."
            });

        })
    );

};