import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateGroupAvatar } from "../service/group.service";
import { useChatStore } from "../store/chat.store";
import { syncUpdatedGroup } from "../utils/group-cache.utils";


export const useUpdateGroupAvatar = () => {

    const queryClient = useQueryClient();

    const {
        selectedChat,
        updateSelectedChat,
    } = useChatStore();

    return useMutation({

        mutationFn: updateGroupAvatar,

        onSuccess: (updatedGroup) => {

            syncUpdatedGroup({
                queryClient,
                updatedGroup,
                selectedChat,
                updateSelectedChat,
            });

            toast.success(
                "Group avatar updated successfully"
            );
        },

        onError: (error: any) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to update group avatar"
            );
        },
    });
};