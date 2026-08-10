import { Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthRequest } from "../auth/auth.types";
import { getUnreadNotifications, markNotificationAsRead } from "./notification.service";

export const getUnreadNotificationsController = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const userId = req.user!.id;

        const notifications =
            await getUnreadNotifications(userId);

        return res.status(200).json({
            success: true,
            message: "Unread notifications fetched successfully",
            notifications,
        });
    }
);

export const markNotificationAsReadController = catchAsync(
    async (
        req: AuthRequest,
        res: Response
    ) => {

        const notificationId =
            req.params.notificationId as string;

        const userId = req.user!.id;

        const notification =
            await markNotificationAsRead(
                notificationId,
                userId
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification,
        });
    }
);