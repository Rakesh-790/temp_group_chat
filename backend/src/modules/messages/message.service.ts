import mongoose from "mongoose";
import { getGroupById } from "../groups/group.service";
import { IMessage, Message } from "./message.model";
import { CreateMessageInput, MarkMessageDeliveredInput, MarkMessageReadInput, MessageDeliveryUpdate, MessageReadUpdate } from "./message.types";
import { AppError } from "../../utils/AppError";
import groupModel from "../groups/group.model";
import { ensureUserIsMember } from "../groups/group.permission";

export const createMessage = async (
    input: CreateMessageInput
): Promise<IMessage> => {

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

    if (replyTo) {
        await ensureMessageExists(replyTo);
    }

    const createdMessage = await Message.create({
        group: group._id,
        sender: senderId,
        type,
        content,
        attachments,
        replyTo,
    });

    const message = await Message.findById(createdMessage._id)
        .populate("sender", "username avatar")
        .populate({
            path: "replyTo",
            select: "content sender createdAt",
            populate: {
                path: "sender",
                select: "username avatar",
            },
        });

    if (!message) {
        throw new AppError(
            "Failed to create message.",
            500
        );
    }

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

export const hasUserReadMessage = ( // helper method for read receipt.
    message: IMessage,
    userId: string
): boolean => {

    return message.readBy.some(
        receipt => receipt.user.toString() === userId
    );

};

export const markMessageAsRead = async (
    input: MarkMessageReadInput
): Promise<MessageReadUpdate> => {

    const { groupId, messageIds, userId } = input;

    const group = await getGroupById(groupId);

    ensureUserIsMember(group, userId);

    const messages = await Message.find({
        _id: { $in: messageIds },
        group: groupId,
    });

    if (messages.length !== messageIds.length) {
        throw new AppError(
            "One or more messages were not found.",
            404
        );
    }

    const readAt = new Date();

    const senderIds = new Set<string>();
    const updatedMessageIds: string[] = [];

    for (const message of messages) {

        if (message.sender.toString() === userId) {
            continue;
        }

        if (hasUserReadMessage(message, userId)) {
            continue;
        }

        senderIds.add(message.sender.toString());
        updatedMessageIds.push(message._id.toString());
    }

    if (updatedMessageIds.length > 0) {

        await Message.updateMany(
            {
                _id: { $in: updatedMessageIds }
            },
            {
                $push: {
                    readBy: {
                        user: new mongoose.Types.ObjectId(userId),
                        readAt,
                    },
                },
            }
        );

    }

    return {
        messageIds: updatedMessageIds,
        userId,
        readAt,
        senderIds: [...senderIds],
    };
};

export const hasUserReceivedMessage = ( // helper method for delivery status.
    message: IMessage,
    userId: string
): boolean => {

    return message.deliveredTo.some(
        id => id.toString() === userId
    );
};

export const markMessageAsDelivered = async (
    input: MarkMessageDeliveredInput
): Promise<MessageDeliveryUpdate> => {

    const { groupId, messageIds, userId } = input;

    const group = await getGroupById(groupId);

    ensureUserIsMember(group, userId);

    const messages = await Message.find({
        _id: { $in: messageIds },
        group: groupId,
    });

    if (messages.length !== messageIds.length) {
        throw new AppError(
            "One or more messages were not found.",
            404
        );
    }

    const senderIds = new Set<string>();
    const updatedMessageIds: string[] = [];

    for (const message of messages) {

        if (message.sender.toString() === userId) {
            continue;
        }

        if (hasUserReceivedMessage(message, userId)) {
            continue;
        }

        senderIds.add(message.sender.toString());
        updatedMessageIds.push(message._id.toString());
    }

    if (updatedMessageIds.length > 0) {

        await Message.updateMany(
            {
                _id: { $in: updatedMessageIds },
            },
            {
                $addToSet: {
                    deliveredTo: new mongoose.Types.ObjectId(userId),
                },
            }
        );

    }

    return {
        messageIds: updatedMessageIds,
        userId,
        senderIds: [...senderIds],
    };
};

export const markPendingMessagesAsDelivered = async (
    userId: string
): Promise<MessageDeliveryUpdate[]> => {

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const groups = await groupModel.find({
        "members.user": objectUserId,
        isDeleted: false,
    }).select("_id");

    if (groups.length === 0) {
        return [];
    }

    const groupIds = groups.map(group => group._id);

    const messages = await Message.find({
        group: { $in: groupIds },
        sender: { $ne: objectUserId },
        deleted: false,
        deliveredTo: { $ne: objectUserId },
    }).select("_id sender");

    if (messages.length === 0) {
        return [];
    }

    const messageIds = messages.map(message => message._id);

    await Message.updateMany(
        {
            _id: { $in: messageIds },
        },
        {
            $addToSet: {
                deliveredTo: objectUserId,
            },
        }
    );

    const updates = new Map<string, MessageDeliveryUpdate>();

    for (const message of messages) {

        const senderId = message.sender.toString();

        if (!updates.has(senderId)) {
            updates.set(senderId, {
                senderIds: [senderId],
                userId,
                messageIds: [],
            });
        }

        updates.get(senderId)!.messageIds.push(
            message._id.toString()
        );
    }

    return [...updates.values()];
};

export const getGroupMessages = async (
    groupId: string,
    userId: string,
    page: number = 1,
    limit: number = 30
): Promise<{
    messages: IMessage[];
    hasNextPage: boolean;
}> => {

    const group = await getGroupById(groupId);

    ensureUserIsMember(group, userId);

    const skip = (page - 1) * limit;

    const messages = await Message.find({
        group: groupId,
        deleted: false
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("sender", "username avatar")
        .populate({
            path: "replyTo",
            select: "content sender createdAt"
        });

    const totalMessages = await Message.countDocuments({
        group: groupId,
        deleted: false
    });

    return {
        messages: messages.reverse(),
        hasNextPage: skip + limit < totalMessages
    };
};