import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import { isPublicAuthRoute } from "../../utils/auth";
import { getProfile } from "../../service/auth.service";
import { getUnreadNotifications, markNotificationAsRead } from "../../service/notification.service";
import { queryClient } from "../../lib/react-query";
import type { Group } from "../../types/group.types";
import { useChatStore } from "../../store/chat.store";


const useSession = () => {

    const location = useLocation();

    const setUser =
        useAuthStore((state) => state.setUser);

    const clearAuth =
        useAuthStore((state) => state.clearAuth);

    const setLoading =
        useAuthStore((state) => state.setLoading);

    useEffect(() => {

        if (
            isPublicAuthRoute(location.pathname)
        ) {
            setLoading(false);
            return;
        }

        const restoreSession = async () => {

            try {

                const response = await getProfile();

                setUser(response.profile);

            } catch {

                clearAuth();

                setLoading(false);

                return;
            }

            try {

                const notifications =
                    await getUnreadNotifications();

                for (
                    const notification
                    of notifications
                ) {

                    if (
                        notification.action === "MEMBER_REMOVED"
                    ) {

                        const payload =
                            notification.payload as {
                                groupId?: string;
                                groupName?: string;
                            };

                        const groupId =
                            payload.groupId;

                        const groupName =
                            payload.groupName ?? "the group";

                        if (groupId) {

                            queryClient.setQueryData<Group[]>(
                                ["groups"],
                                (oldGroups) => {

                                    if (!oldGroups) {
                                        return oldGroups;
                                    }

                                    return oldGroups.filter(
                                        group =>
                                            group._id !== groupId
                                    );
                                }
                            );

                            const {
                                selectedChat,
                                clearSelectedChat,
                            } =
                                useChatStore.getState();

                            if (
                                selectedChat?._id === groupId
                            ) {
                                clearSelectedChat();
                            }
                        }

                        toast.error(
                            `You have been removed from "${groupName}".`
                        );
                    }

                    await markNotificationAsRead(
                        notification._id
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load notifications:",
                    error
                );

                // Do NOT clear authentication.
            } finally {

                setLoading(false);

            }
        };

        restoreSession();

    }, [
        location.pathname,
        setUser,
        clearAuth,
        setLoading,
    ]);

};

export default useSession;