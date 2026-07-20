export interface Group {
    _id: string;
    name: string;
    description?: string;
    inviteCode: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface GroupsResponse {
    groups: Group[];
    totalGroups: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
