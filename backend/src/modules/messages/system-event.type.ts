import { SystemAction } from "./message.model";

export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";

export interface RoleChangedEvent {
    action: SystemAction.ROLE_CHANGED;

    metadata: {
        targetUserId: string;
        previousRole: GroupRole;
        newRole: GroupRole;
    }
};

export interface MemberJoinedEvent {
    action: SystemAction.MEMBER_JOINED;

    metadata: {
        userId: string;
    };
};

export interface MemberRemovedEvent {
    action: SystemAction.MEMBER_REMOVED;

    metadata: {
        targetUserId: string;
        previousRole: GroupRole;
    };
};

export interface GroupCreatedEvent {
    action: SystemAction.GROUP_CREATED;

    metadata: {};
};

export interface GroupRenamedEvent {
    action: SystemAction.GROUP_RENAMED;

    metadata: {
        oldName: string;
        newName: string;
    };
};

export interface GroupDescriptionUpdatedEvent {
    action: SystemAction.GROUP_DESCRIPTION_UPDATED;

    metadata: {
        oldDescription: string | null;
        newDescription: string | null;
    };
};

export interface OwnerTransferredEvent {
    action: SystemAction.OWNER_TRANSFERRED;

    metadata: {
        previousOwnerId: string;
        newOwnerId: string;
    };
};

export interface GroupAvatarChangedEvent {
    action: SystemAction.GROUP_AVATAR_CHANGED;

    metadata: {};
};

export type SystemEvent =
    | RoleChangedEvent
    | MemberJoinedEvent
    | MemberRemovedEvent
    | GroupCreatedEvent
    | GroupRenamedEvent
    | GroupDescriptionUpdatedEvent
    | OwnerTransferredEvent
    | GroupAvatarChangedEvent;