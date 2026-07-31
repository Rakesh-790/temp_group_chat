import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../api/socket";
import type { ApiMessage, GetMessagesResponse } from "../types/message.types";
import type { Group } from "../types/group.types";

export const useMessageEvents = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleNewMessage = (message: ApiMessage) => {

            // Update messages cache
            queryClient.setQueryData<GetMessagesResponse>(
                ["messages", message.group],
                (oldData) => {
                    if (!oldData) {
                        return {
                            messages: [message],
                            hasNextPage: false,
                        };
                    }

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

            // Update groups cache
            queryClient.setQueryData<Group[]>(
                ["groups"],
                (oldGroups) => {
                    if (!oldGroups) return oldGroups;

                    return oldGroups.map((group) => {
                        if (group._id !== message.group) {
                            return group;
                        }

                        return {
                            ...group,
                            lastMessage: {
                                _id: message._id,
                                content: message.content,
                                sender: message.sender,
                                createdAt: message.createdAt,
                            },
                        };
                    });
                }
            );
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [queryClient]);
};