import mongoose from "mongoose";
import { ensureUserIsMember, getGroupById } from "../groups/group.service";
import { IMessage, Message } from "./message.model";
import { CreateMessageInput } from "./message.types";
import { AppError } from "../../utils/AppError";

export const createMessage = async(
    input: CreateMessageInput
) : Promise<IMessage> => {

    const {
        groupId,
        senderId,
        type,
        content,
        attachments,
        replyTo
    } = input;

    const group = await getGroupById(groupId);

    ensureUserIsMember(group, senderId);

    if(replyTo){
        await ensureMessageExists(replyTo);
    };

    const message = await Message.create({
        group: group._id,
        sender: senderId,
        type,
        content,
        attachments,
        replyTo
    });

    return message;
};

export const getMessageById = async (
    messageId: string
): Promise<IMessage | null> => {

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new AppError("Invalid message id", 400);
    };

    return Message.findById(messageId);
};

export const ensureMessageExists = async (
    messageId: string
): Promise<IMessage> => {

    const message = await getMessageById(messageId);

    if (!message) {
        throw new AppError("Message not found", 404);
    };

    return message;
};

export const ensureMessageSender = (
    message: IMessage,
    userId: string
): void => {

    if (message.sender.toString() !== userId) {
        throw new AppError(
            "You are not authorized to perform this action.",
            403
        );
    };
};