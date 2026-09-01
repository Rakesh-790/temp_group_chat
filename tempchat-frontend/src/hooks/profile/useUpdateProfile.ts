import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, type UpdateProfilePayload } from "../service/profile.service";


export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfilePayload) =>
            updateProfile(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["profile"],
            });
        },
    });
};