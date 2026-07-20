import api from "../api/axios";
import type { GetMessagesResponse } from "../types/message.types";

export const getMessages = async (
    groupId: string
): Promise<GetMessagesResponse> => {

    const response = await api.get(
        `/messages/groups/${groupId}/messages`
    );

    return response.data.data;
};