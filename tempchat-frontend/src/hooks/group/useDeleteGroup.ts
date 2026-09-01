import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useChatStore } from "../../store/chat.store";
import { deleteGroup } from "../../service/group.service";


export const useDeleteGroup = () => {
    const queryClient = useQueryClient();

    const clearSelectedChat = useChatStore(
        (state) => state.clearSelectedChat
    );

    return useMutation({
        mutationFn: deleteGroup,

        onSuccess: () => {
            toast.success("Group deleted successfully");

            clearSelectedChat();

            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ??
                    "Failed to delete group"
            );
        },
    });
};