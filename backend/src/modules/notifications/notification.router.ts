import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUnreadNotificationsController, markNotificationAsReadController } from "./notification.controller";

export const notificationRouter = express.Router();

notificationRouter.get("/unread", authMiddleware, getUnreadNotificationsController);

notificationRouter.patch("/:notificationId/read", authMiddleware, markNotificationAsReadController);