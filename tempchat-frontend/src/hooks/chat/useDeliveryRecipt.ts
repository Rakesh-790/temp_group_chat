import { useEffect, useMemo } from "react";
import type { ApiMessage } from "../../types/message.types";
import { useAuthStore } from "../../store/auth.store";
import { markMessagesDelivered } from "../../service/socket.service";

export const useDeliveryReceipt = (
    groupId: string | null,
    messages: ApiMessage[]
): void => {

    const currentUser = useAuthStore((state) => state.user);

    const messageIdsToDeliver = useMemo(() => {

        if (!currentUser || !groupId) {
            return [];
        }

        return messages
            .filter((message) => {

                // Don't deliver our own messages
                if (message.sender._id === currentUser.id) {
                    return false;
                }

                // Already delivered by this user
                if (message.deliveredTo.includes(currentUser.id)) {
                    return false;
                }

                return true;

            })
            .map((message) => message._id);

    }, [messages, currentUser, groupId]);

    useEffect(() => {

        if (!groupId) {
            return;
        }

        if (messageIdsToDeliver.length === 0) {
            return;
        }

        void markMessagesDelivered({
            groupId,
            messageIds: messageIdsToDeliver,
        });

    }, [groupId, messageIdsToDeliver]);

};