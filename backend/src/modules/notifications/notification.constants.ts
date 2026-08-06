export const NotificationType = {
    GROUP: "GROUP",
    CHAT: "CHAT",
    SYSTEM: "SYSTEM",
    SECURITY: "SECURITY",
} as const;

export const NotificationAction = {
    MEMBER_REMOVED: "MEMBER_REMOVED",

    MEMBER_ADDED: "MEMBER_ADDED",

    ROLE_CHANGED: "ROLE_CHANGED",

    GROUP_EXPIRED: "GROUP_EXPIRED",

    OWNER_TRANSFERRED: "OWNER_TRANSFERRED",
} as const;

export type NotificationTypeValue =
    typeof NotificationType[keyof typeof NotificationType];

export type NotificationActionValue =
    typeof NotificationAction[keyof typeof NotificationAction];