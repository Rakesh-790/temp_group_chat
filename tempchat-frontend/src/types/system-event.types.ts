export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";

export const SystemAction = {
    ROLE_CHANGED: "ROLE_CHANGED",

    MEMBER_JOINED: "MEMBER_JOINED",

    MEMBER_LEFT: "MEMBER_LEFT",

    MEMBER_REMOVED: "MEMBER_REMOVED",

    GROUP_CREATED: "GROUP_CREATED",

    GROUP_RENAMED: "GROUP_RENAMED",

    GROUP_DESCRIPTION_UPDATED: "GROUP_DESCRIPTION_UPDATED",

    GROUP_AVATAR_CHANGED: "GROUP_AVATAR_CHANGED",

    OWNER_TRANSFERRED: "OWNER_TRANSFERRED",

    GROUP_EXPIRED: "GROUP_EXPIRED",

    GROUP_DELETED: "GROUP_DELETED",
} as const;

export type SystemAction =
    (typeof SystemAction)[keyof typeof SystemAction];

export interface RoleChangedEvent {
    action: typeof SystemAction.ROLE_CHANGED;

    metadata: {
        targetUserId: string;
        previousRole: GroupRole;
        newRole: GroupRole;
    };
}

export interface MemberJoinedEvent {
    action: typeof SystemAction.MEMBER_JOINED;

    metadata: {
        userId: string;
    };
}

export interface MemberRemovedEvent {
    action: typeof SystemAction.MEMBER_REMOVED;

    metadata: {
        targetUserId: string;
        targetUsername: string;
        previousRole: GroupRole;
    }
}

export interface GroupCreatedEvent {
    action: typeof SystemAction.GROUP_CREATED;

    metadata: Record<string, never>;
}

export interface GroupRenamedEvent {
    action: typeof SystemAction.GROUP_RENAMED;

    metadata: {
        oldName: string;
        newName: string;
    };
}

export interface GroupDescriptionUpdatedEvent {
    action: typeof SystemAction.GROUP_DESCRIPTION_UPDATED;

    metadata: {
        oldDescription: string | null;
        newDescription: string | null;
    };
}

export interface OwnerTransferredEvent {
    action: typeof SystemAction.OWNER_TRANSFERRED;

    metadata: {
        previousOwnerId: string;
        newOwnerId: string;
    };
}

export interface GroupAvatarChangedEvent {
    action: typeof SystemAction.GROUP_AVATAR_CHANGED;

    metadata: Record<string, never>;
}

export type SystemEvent =
    | RoleChangedEvent
    | MemberJoinedEvent
    | MemberRemovedEvent
    | GroupCreatedEvent
    | GroupRenamedEvent
    | GroupDescriptionUpdatedEvent
    | OwnerTransferredEvent
    | GroupAvatarChangedEvent;