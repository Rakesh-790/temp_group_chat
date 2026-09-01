import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useChatStore } from "../../store/chat.store";
import { updateGroup } from "../../service/group.service";
import { syncUpdatedGroup } from "../../utils/group-cache.utils";


export const useUpdateGroup = () => {

    const queryClient = useQueryClient();

    const {
        selectedChat,
        updateSelectedChat,
    } = useChatStore();

    return useMutation({

        mutationFn: updateGroup,

        onSuccess: (updatedGroup) => {

            syncUpdatedGroup({
                queryClient,
                updatedGroup,
                selectedChat,
                updateSelectedChat,
            });

            toast.success(
                "Group updated successfully"
            );
        },

        onError: (error: any) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to update group"
            );
        },
    });
};