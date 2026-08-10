import { Notification } from "./notification.model";
import { NotificationActionValue, NotificationTypeValue } from "./notification.constants";
import { ClientSession } from "mongoose";

interface CreateNotificationData {
    recipientId: string;

    type: NotificationTypeValue;

    action: NotificationActionValue;

    title: string;

    message?: string;

    payload?: Record<string, unknown>;

    session?: ClientSession;
}

export const createNotification = async (
    data: CreateNotificationData
) => {

    const notification = new Notification({
        recipient: data.recipientId,

        type: data.type,

        action: data.action,

        title: data.title,

        message: data.message ?? null,

        payload: data.payload ?? {},

        delivered: false,

        read: false,
    });

    await notification.save({
        session: data.session,
    });

    return notification;
};

export const getUnreadNotifications = async (
    userId: string
) => {

    return Notification.find({
        recipient: userId,
        read: false,
    })
        .sort({
            createdAt: -1,
        })
        .lean();
};

export const markNotificationAsRead = async (
    notificationId: string,
    userId: string
) => {

    return Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
        },
        {
            $set: {
                read: true,
            },
        },
        {
            new: true,
        }
    );
};