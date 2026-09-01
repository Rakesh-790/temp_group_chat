import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../../service/group.service";


export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroup,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });
        },
    });
};