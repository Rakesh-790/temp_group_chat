import type { QueryClient } from "@tanstack/react-query";
import type { Group } from "../types/group.types";

interface SyncUpdatedGroupParams {
    queryClient: QueryClient;
    updatedGroup: Group;
    selectedChat: Group | null;
    updateSelectedChat: (group: Group) => void;
}

export const syncUpdatedGroup = ({
    queryClient,
    updatedGroup,
    selectedChat,
    updateSelectedChat,
}: SyncUpdatedGroupParams) => {

    queryClient.setQueryData<Group[]>(
        ["groups"],
        (oldGroups) => {

            if (!oldGroups) {
                return oldGroups;
            }

            return oldGroups.map((group) =>
                group._id === updatedGroup._id
                    ? {
                          ...group,
                          ...updatedGroup,
                      }
                    : group
            );
        }
    );

    if (
        selectedChat &&
        selectedChat._id === updatedGroup._id
    ) {
        updateSelectedChat(updatedGroup);
    }
};