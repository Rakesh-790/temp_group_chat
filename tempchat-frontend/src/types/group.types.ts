export interface GroupUser {
    _id: string;
    username: string;
    bio: string;

    avatar: {
        url: string | null;
        key?: string | null;
    };
}

export interface GroupMember {
    user: GroupUser;
    role: "OWNER" | "ADMIN" | "MEMBER";
    joinedAt: string;
};

export interface Group {
    _id: string;
    name: string;
    description?: string;

    owner: GroupUser;
    members: GroupMember[];

    inviteCode: string;

    expiresAt: string;

    isDeleted: boolean;
    deletedAt: string | null;

    createdAt: string;
    updatedAt: string;
};

export interface GroupsResponse {
    groups: Group[];
    totalGroups: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export interface CreateGroupRequest {
    name: string;
    description?: string;
    duration: number;
};

export interface CreatedGroup {
    id: string;
    name: string;
    owner: {
        _id: string;
        username: string;
    };
    inviteCode: string;
    expiresAt: string;
};

export interface CreateGroupResponse {
    success: boolean;
    message: string;
    group: CreatedGroup;
};

export interface JoinGroupRequest {
    inviteCode: string;
};

export interface JoinedGroup {
    id: string;
    name: string;
    expiresAt: string;
};

export interface JoinGroupResponse {
    success: boolean;
    message: string;
    group: JoinedGroup;
};

export interface DeleteGroupResponse {
    success: boolean;
    message: string;
    group: {
        groupId: string;
        name: string;
        deletedAt: string;
    };
};