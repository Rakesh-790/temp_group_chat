import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { GroupsResponse } from "../../types/group.types";
import { socket } from "../../api/socket";


type UserOnlinePayload = {
    userId: string;
};

type UserOfflinePayload = {
    userId: string;
    lastSeen: string;
};

export const usePresence = () => {

    const queryClient = useQueryClient();

    useEffect(() => {

        const onUserOnline = ({ userId }: UserOnlinePayload) => {

            queryClient.setQueryData<GroupsResponse>(
                ["groups"],
                (oldData) => {

                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        groups: oldData.groups.map((group) => ({
                            ...group,
                            owner:
                                group.owner._id === userId
                                    ? {
                                        ...group.owner,
                                        isOnline: true,
                                    }
                                    : group.owner,
                            members: group.members.map((member) => ({
                                ...member,
                                user:
                                    member.user._id === userId
                                        ? {
                                            ...member.user,
                                            isOnline: true,
                                        }
                                        : member.user,
                            })),
                        })),
                    };
                }
            );
        };

        const onUserOffline = ({
            userId,
            lastSeen,
        }: UserOfflinePayload) => {

            queryClient.setQueryData<GroupsResponse>(
                ["groups"],
                (oldData) => {

                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        groups: oldData.groups.map((group) => ({
                            ...group,
                            owner:
                                group.owner._id === userId
                                    ? {
                                        ...group.owner,
                                        isOnline: false,
                                        lastSeen,
                                    }
                                    : group.owner,
                            members: group.members.map((member) => ({
                                ...member,
                                user:
                                    member.user._id === userId
                                        ? {
                                            ...member.user,
                                            isOnline: false,
                                            lastSeen,
                                        }
                                        : member.user,
                            })),
                        })),
                    };
                }
            );
        };

        socket.on("user:online", onUserOnline);
        socket.on("user:offline", onUserOffline);

        return () => {
            socket.off("user:online", onUserOnline);
            socket.off("user:offline", onUserOffline);
        };

    }, [queryClient]);

};