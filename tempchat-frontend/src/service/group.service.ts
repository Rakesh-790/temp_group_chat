import api from "../api/axios";
import type { Group, GroupsResponse } from "../types/group.types";

export const getGroups = async (): Promise<Group[]> => {
    const response = await api.get<{ groups: GroupsResponse }>("/groups");
    return response.data.groups.groups;
};
