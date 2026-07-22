import api from "../api/axios";
import { socket } from "../api/socket";
import type { GetMessagesResponse } from "../types/message.types";

export const getMessages = async (
    groupId: string,
    page = 1,
    limit = 30
): Promise<GetMessagesResponse> => {
    const response = await api.get(
        `/messages/groups/${groupId}/messages`,
        {
            params: {
                page,
                limit,
            },
        }
    );

    return response.data.data;
};

export const sendMessage = (
    payload: {
        groupId: string;
        type: string;
        content: string;
        attachments?: [];
        replyTo?: string | null;
    }
): Promise<void> => {
    return new Promise((resolve, reject) => {
        socket.emit(
            "message:send",
            payload,
            (response: {
                success: boolean;
                message: string;
            }) => {
                if (response.success) {
                    resolve();
                } else {
                    reject(new Error(response.message));
                }
            }
        );
    });
};