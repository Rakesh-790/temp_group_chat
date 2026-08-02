import type { ApiMessage, Message } from "../types/message.types";
import { useAuthStore } from "../store/auth.store";

export const mapMessage = (
    apiMessage: ApiMessage,
    recipientCount: number
): Message => {

    const currentUser = useAuthStore.getState().user;

    const currentUserId = currentUser?.id ?? "";

    const isMine = apiMessage.sender._id === currentUserId;

    let status: Message["status"] = "sent";

    if (isMine) {

        if (
            recipientCount > 0 &&
            apiMessage.readBy.length === recipientCount
        ) {
            status = "read";
        } else if (apiMessage.deliveredTo.length > 0) {
            status = "delivered";
        }
    
    }

    return {
        id: apiMessage._id,

        senderId: apiMessage.sender._id,

        senderName: apiMessage.sender.username,

        senderAvatar: apiMessage.sender.avatar,

        type: apiMessage.type,

        content: apiMessage.content ?? "",

        systemEvent: apiMessage.systemEvent,

        createdAt: new Date(apiMessage.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),

        isMine,

        status,

        edited: apiMessage.edited,

        editedAt: apiMessage.editedAt ?? undefined,

        replyTo: apiMessage.replyTo
            ? {
                  id: apiMessage.replyTo._id,
                  senderName: apiMessage.replyTo.sender.username,
                  content: apiMessage.replyTo.content,
              }
            : null,

        attachments: apiMessage.attachments.map((attachment, index) => ({
            id: `${apiMessage._id}-${index}`,
            url: attachment.url,
            fileName: attachment.fileName,
            type: attachment.mimeType.startsWith("image/")
                ? "image"
                : attachment.mimeType.startsWith("video/")
                ? "video"
                : "file",
        })),

        reactions: [],
    };
};