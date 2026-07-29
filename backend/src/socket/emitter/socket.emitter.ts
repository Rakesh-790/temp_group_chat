import { IMessage } from "../../modules/messages/message.model";
import { getIo } from "../socket.server";

export const emitNewMessage = (
    groupId: string,
    message: IMessage
) => {
    getIo()
        .to(groupId)
        .emit("message:new", message);
};