import api from "../api/axios";

export interface NotificationPayload {
    _id: string;
    type: string;
    action: string;
    title: string;
    message: string | null;
    payload: Record<string, unknown>;
    delivered: boolean;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GetUnreadNotificationsResponse {
    success: boolean;
    message: string;
    notifications: NotificationPayload[];
}

interface MarkNotificationAsReadResponse {
    success: boolean;
    message: string;
    notification: NotificationPayload;
}

export const getUnreadNotifications = async (): Promise<
    NotificationPayload[]
> => {

    const response =
        await api.get<GetUnreadNotificationsResponse>(
            "/notifications/unread"
        );

    return response.data.notifications;
};

export const markNotificationAsRead = async (
    notificationId: string
): Promise<NotificationPayload> => {

    const response =
        await api.patch<MarkNotificationAsReadResponse>(
            `/notifications/${notificationId}/read`
        );

    return response.data.notification;
};