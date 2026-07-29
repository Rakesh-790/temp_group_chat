import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../store/chat.store";
import { assignRole } from "../service/group.service";
import toast from "react-hot-toast";

export const useAssignRole = () => {
    const queryClient = useQueryClient();
    const { selectChat } = useChatStore();

    return useMutation({
        mutationFn: assignRole,

        onSuccess: (data) => {
            toast.success("Role updated");
        
            selectChat(data.group);
        
            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });
        
            queryClient.invalidateQueries({
                queryKey: ["messages"],
            });
        },
    });
};