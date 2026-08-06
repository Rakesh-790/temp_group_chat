import { ClientSession } from "mongoose";
import { AppError } from "../../utils/AppError";
import { getGroupById } from "../groups/group.service";
import { Message, MessageType, SystemAction } from "./message.model";
import { SystemEvent } from "./system-event.type";

interface CreateSystemMessageInput {
    groupId: string;
    senderId: string;
    event: SystemEvent;
    session?: ClientSession;
};

export const createSystemMessage = async (
    input: CreateSystemMessageInput
) => {

    const message = new Message({
        group: input.groupId,

        sender: input.senderId,

        type: MessageType.SYSTEM,

        content: null,

        systemEvent: input.event,
    });

    await message.save({
        session: input.session,
    });

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "username avatar")
        .session(input.session ?? null);

    if (!populatedMessage) {
        throw new AppError(
            "Failed to create system message",
            500
        );
    }

    return populatedMessage;
};