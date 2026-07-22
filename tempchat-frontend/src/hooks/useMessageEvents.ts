import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiMessage, GetMessagesResponse } from "../types/message.types";
import { socket } from "../api/socket";

export const useMessageEvents = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleNewMessage = (message: ApiMessage) => {
            queryClient.setQueryData<GetMessagesResponse>(
                ["messages", message.group],
                (oldData) => {
                    if (!oldData) {
                        return {
                            messages: [message],
                            hasNextPage: false,
                        };
                    }

                    // Prevent duplicate messages
                    const exists = oldData.messages.some(
                        (m) => m._id === message._id
                    );

                    if (exists) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        messages: [...oldData.messages, message],
                    };
                }
            );
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [queryClient]);
};