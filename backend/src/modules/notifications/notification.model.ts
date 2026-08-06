import { InferSchemaType, model, Schema, Types } from "mongoose";
import { NotificationAction, NotificationType } from "./notification.constants";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: true,
        },

        action: {
            type: String,
            enum: Object.values(NotificationAction),
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            default: null,
            trim: true,
        },

        payload: {
            type: Schema.Types.Mixed,
            default: {},
        },

        delivered: {
            type: Boolean,
            default: false,
        },

        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
    recipient: 1,
    createdAt: -1,
});

notificationSchema.index({
    recipient: 1,
    read: 1,
});

export type INotification = InferSchemaType<typeof notificationSchema> & { _id: Types.ObjectId; };

export const Notification = model("notification", notificationSchema);