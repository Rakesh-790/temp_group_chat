import { useEffect, useMemo } from "react";
import { useAuthStore } from "../store/auth.store";
import { markMessagesRead } from "../service/socket.service";
import type { ApiMessage } from "../types/message.types";

export const useReadReceipt = (
    groupId: string | null,
    messages: ApiMessage[]
): void => {

    const currentUser = useAuthStore(
        (state) => state.user
    );

    const messageIdsToRead = useMemo(() => {

        if (!currentUser || !groupId) {
            return [];
        }

        return messages
            .filter((message) => {

                // Ignore our own messages
                if (message.sender._id === currentUser.id) {
                    return false;
                }

                // Already read by me
                if (
                    message.readBy.some(
                        (receipt) => receipt.user === currentUser.id
                    )
                ) {
                    return false;
                }

                return true;

            })
            .map((message) => message._id);

    }, [messages, currentUser, groupId]);

    useEffect(() => {

        if (!groupId || messageIdsToRead.length === 0) {
            return;
        }

        void markMessagesRead({
            groupId,
            messageIds: messageIdsToRead,
        }).catch((error) => {
            console.error(
                "Failed to mark messages as read:",
                error
            );
        });

    }, [groupId, messageIdsToRead]);

};