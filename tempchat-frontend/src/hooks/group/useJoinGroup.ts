import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroup } from "../service/group.service";

export const useJoinGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: joinGroup,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });
        },
    });
};