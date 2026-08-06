import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { removeMember } from "../service/group.service";

export const useRemoveMember = () => {

    return useMutation({

        mutationFn: removeMember,

        onSuccess: () => {

            toast.success(
                "Member removed successfully."
            );

        },

        onError: (error: any) => {

            toast.error(
                error?.response?.data?.message ??
                "Failed to remove member."
            );

        },

    });

};