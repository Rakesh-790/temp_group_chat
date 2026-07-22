import api from "../api/axios";
import type { CreateGroupRequest, CreateGroupResponse, DeleteGroupResponse, Group, GroupsResponse, JoinGroupRequest, JoinGroupResponse } from "../types/group.types";

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