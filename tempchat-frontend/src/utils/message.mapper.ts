import type { ApiMessage, Message } from "../types/message.types";
import { useAuthStore } from "../store/auth.store";

export const mapMessage = (
    apiMessage: ApiMessage
): Message => {

    const currentUser = useAuthStore.getState().user;

    const isMine = apiMessage.sender._id === currentUser?.id;

    let status: Message["status"] = "sent";

    if (apiMessage.readBy.length > 0) {
        status = "read";
    } else if (apiMessage.deliveredTo.length > 0) {
        status = "delivered";
    }

    return {
        id: apiMessage._id,

        senderId: apiMessage.sender._id,

        senderName: apiMessage.sender.username,

        content: apiMessage.content,

        createdAt: new Date(
            apiMessage.createdAt
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),

        isMine,

        status,

        edited: false,

        attachments: [],

        reactions: [],

        replyTo: null,
    };
};