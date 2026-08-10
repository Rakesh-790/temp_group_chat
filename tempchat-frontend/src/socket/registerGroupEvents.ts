import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { queryClient } from "../lib/react-query";
import { useChatStore } from "../store/chat.store";
import { leaveRoom } from "../service/socket.service";
import type { Group } from "../types/group.types";

interface GroupRemovedPayload {
    groupId: string;
    groupName: string;
    removedBy: string;

    // notificationId?: string;
}

export const registerGroupEvents = (
    socket: Socket
) => {

    const onGroupRemoved = async (
        payload: GroupRemovedPayload
    ) => {

        queryClient.setQueryData<Group[]>(
            ["groups"],
            (oldGroups) => {

                if (!oldGroups) {
                    return oldGroups;
                }

                return oldGroups.filter(
                    group => group._id !== payload.groupId
                );

            }
        );

        const {
            selectedChat,
            clearSelectedChat,
        } = useChatStore.getState();

        if (
            selectedChat?._id === payload.groupId
        ) {
            clearSelectedChat();
        }

        try {

            await leaveRoom(payload.groupId);

        } catch {

            console.warn(
                "Already removed from room."
            );

        }

        toast.error(
            `You have been removed from "${payload.groupName}".`
        );

        /**
         * TODO
         * Mark notification delivered.
         */

    };

    const onMemberRemoved = (
        updatedGroup: Group
    ) => {

        queryClient.setQueryData<Group[]>(
            ["groups"],
            (oldGroups) => {

                if (!oldGroups) {
                    return oldGroups;
                }

                return oldGroups.map(group => {

                    if (
                        group._id !== updatedGroup._id
                    ) {
                        return group;
                    }

                    return updatedGroup;

                });

            }
        );

        const {
            selectedChat,
            updateSelectedChat,
        } = useChatStore.getState();

        if (
            selectedChat?._id === updatedGroup._id
        ) {
            updateSelectedChat(updatedGroup);
        }

    };

    const onGroupUpdated = async ({
        groupId,
    }: {
        groupId: string;
        action: "MEMBER_JOINED" | "ROLE_CHANGED" | "MEMBER_REMOVED";
    }) => {

        await queryClient.refetchQueries({
            queryKey: ["groups"],
        });

        const updatedGroups =
            queryClient.getQueryData<Group[]>(["groups"]);

        const updatedGroup = updatedGroups?.find(
            group => group._id === groupId
        );

        if (!updatedGroup) {
            return;
        }

        const {
            selectedChat,
            updateSelectedChat,
        } = useChatStore.getState();

        if (
            selectedChat?._id === groupId
        ) {
            updateSelectedChat(updatedGroup);
        }

    };

    socket.on(
        "group:removed",
        onGroupRemoved
    );

    socket.on(
        "group:memberRemoved",
        onMemberRemoved
    );

    socket.on(
        "group:updated",
        onGroupUpdated
    );

    return () => {

        socket.off(
            "group:removed",
            onGroupRemoved
        );

        socket.off(
            "group:memberRemoved",
            onMemberRemoved
        );

        socket.off(
            "group:updated",
            onGroupUpdated
        );

    };

};