import api from "../api/axios";
import type { CreateGroupRequest, CreateGroupResponse, DeleteGroupResponse, Group, GroupsResponse, JoinGroupRequest, JoinGroupResponse, UpdateGroupAvatarRequest, UpdateGroupAvatarResponse, UpdateGroupResponse } from "../types/group.types";

export const getGroups = async (): Promise<Group[]> => {
    const response = await api.get<{ groups: GroupsResponse }>("/groups");
    return response.data.groups.groups;
};

export const createGroup = async (
    data: CreateGroupRequest
): Promise<CreateGroupResponse> => {
    const response = await api.post<CreateGroupResponse>(
        "/groups/create",
        data
    );

    return response.data;
};

export const joinGroup = async (
    data: JoinGroupRequest
): Promise<JoinGroupResponse> => {
    const response = await api.post<JoinGroupResponse>(
        "/groups/join",
        data
    );

    return response.data;
};

export const deleteGroup = async (
    groupId: string
): Promise<DeleteGroupResponse> => {
    const response = await api.delete<DeleteGroupResponse>(
        `groups/${groupId}`
    );

    return response.data;
};

export interface AssignRoleRequest {
    groupId: string;
    userId: string;
    role: "ADMIN" | "MEMBER";
};

export const assignRole = async ({
    groupId,
    userId,
    role,
}: AssignRoleRequest) => {
    const response = await api.patch(
        `/groups/${groupId}/role`,
        {
            userId,
            role,
        }
    );

    return response.data.data;
};

export interface RemoveMemberRequest {
    groupId: string;
    userId: string;
}

export const removeMember = async ({
    groupId,
    userId,
}: RemoveMemberRequest) => {

    const response = await api.delete(
        `/groups/${groupId}/members/${userId}`
    );

    return response.data.data;
};

export interface UpdateGroupRequest {
    groupId: string;
    name?: string;
    description?: string;
}

export const updateGroup = async ({
    groupId,
    name,
    description,
}: UpdateGroupRequest): Promise<Group> => {

    const response = await api.patch<UpdateGroupResponse>(
        `/groups/${groupId}`,
        {
            name,
            description,
        }
    );

    return response.data.data;
};

export const updateGroupAvatar = async ({
    groupId,
    file
} : UpdateGroupAvatarRequest): Promise<Group> => {

    const formData = new FormData();

    formData.append("avatar", file);

    const response = await api.patch<UpdateGroupAvatarResponse>(
        `/groups/${groupId}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data.data;
};