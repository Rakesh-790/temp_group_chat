import { AppError } from "../../utils/AppError";
import { getGroupById } from "../groups/group.service";
import { Message, MessageType, SystemAction } from "./message.model";
import { SystemEvent } from "./system-event.type";

interface CreateSystemMessageInput {
    groupId: string;
    senderId: string;
    event: SystemEvent;
};

export const createSystemMessage = async (
    input: CreateSystemMessageInput
) => {

    const group = await getGroupById(input.groupId);

    const createdMessage = await Message.create({
        group: group._id,
    
        sender: input.senderId,
    
        type: MessageType.SYSTEM,
    
        content: null,
    
        systemEvent: input.event,
    });

    const message = await Message.findById(createdMessage._id)
    .populate("sender", "username avatar");

    if (!message) {
        throw new AppError(
            "Failed to create system message",
            500
        );
    };

    return message;
};