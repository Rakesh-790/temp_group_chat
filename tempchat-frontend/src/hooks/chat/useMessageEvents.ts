import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { messageKeys } from "./useMessage";
import { useAuthStore } from "../../store/auth.store";
import type { ApiMessage, GetMessagesResponse, MessageDeliveryUpdate, MessageReadUpdate } from "../../types/message.types";
import type { Group } from "../../types/group.types";
import { markMessagesDelivered } from "../../service/socket.service";
import { socket } from "../../api/socket";


export const useMessageEvents = () => {

    const queryClient = useQueryClient();

    const currentUser = useAuthStore((state) => state.user);

    useEffect(() => {

        const handleNewMessage = (message: ApiMessage) => {

            queryClient.setQueryData<GetMessagesResponse>(
                messageKeys.group(message.group),
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

            queryClient.setQueryData<Group[]>(
                ["groups"],
                (oldGroups) => {

                    if (!oldGroups) {
                        return oldGroups;
                    }

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

            if (
                currentUser &&
                message.sender._id !== currentUser.id
            ) {

                void markMessagesDelivered({
                    groupId: message.group,
                    messageIds: [message._id],
                });

            }

        };

        const handleMessageDelivered = (
            update: MessageDeliveryUpdate
        ) => {

            queryClient.setQueriesData<GetMessagesResponse>(
                {
                    queryKey: messageKeys.all,
                },
                (oldData) => {

                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        messages: oldData.messages.map((message) => {

                            if (
                                !update.messageIds.includes(message._id)
                            ) {
                                return message;
                            }

                            if (
                                message.deliveredTo.includes(update.userId)
                            ) {
                                return message;
                            }

                            return {
                                ...message,
                                deliveredTo: [
                                    ...message.deliveredTo,
                                    update.userId,
                                ],
                            };

                        }),
                    };

                }
            );

        };

        const handleMessageRead = (
            update: MessageReadUpdate
        ) => {

            queryClient.setQueriesData<GetMessagesResponse>(
                {
                    queryKey: messageKeys.all,
                },
                (oldData) => {

                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        messages: oldData.messages.map((message) => {

                            if (!update.messageIds.includes(message._id)) {
                                return message;
                            }

                            const alreadyRead = message.readBy.some(
                                (receipt) => receipt.user === update.userId
                            );

                            if (alreadyRead) {
                                return message;
                            }

                            return {
                                ...message,
                                readBy: [
                                    ...message.readBy,
                                    {
                                        user: update.userId,
                                        readAt: update.readAt,
                                    },
                                ],
                            };

                        }),
                    };

                }
            );

        };

        socket.on(
            "message:new",
            handleNewMessage
        );

        socket.on(
            "message:delivery:update",
            handleMessageDelivered
        );

        socket.on("message:read:update", handleMessageRead);

        return () => {

            socket.off(
                "message:new",
                handleNewMessage
            );

            socket.off(
                "message:delivery:update",
                handleMessageDelivered
            );

            socket.off("message:read:update", handleMessageRead);

        };

    }, [queryClient, currentUser]);

};

