import mongoose from "mongoose";
import { ensureUserIsMember, getGroupById } from "../groups/group.service";
import { IMessage, Message } from "./message.model";
import { CreateMessageInput, MarkMessageReadInput, MessageReadUpdate } from "./message.types";
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

export const hasUserReadMessage = (
    message: IMessage,
    userId: string
): boolean => {

    return message.readBy.some(
        receipt => receipt.user.toString() === userId
    );

};

export const markMessageAsRead = async(
    input: MarkMessageReadInput
): Promise<MessageReadUpdate> => {

    const { groupId, messageIds, userId} = input;

    const group = await getGroupById(groupId);

    ensureUserIsMember(group, userId);

    const readAt = new Date();

    const updatedMessages: IMessage[] = [];

    for (const messageId of messageIds){
        const message = await ensureMessageExists(messageId);

        if(message.group.toString() !== groupId){
            throw new AppError(
                "Message does not belong to this group",
                400
            );
        };

        if (hasUserReadMessage(message, userId)) {
            continue;
        };

        await Message.findByIdAndUpdate(
            messageId,
            {
                $push: {
                    readBy: {
                        user: new mongoose.Types.ObjectId(userId),
                        readAt
                    }
                }
            },
            {
                new: true
            }
        );

        updatedMessages.push(message);
    };

    return { messageIds, userId, readAt};
};