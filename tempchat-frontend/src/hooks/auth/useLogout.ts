import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../service/auth.service";


export const useLogout = () => {
    const navigate = useNavigate();

    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useMutation({
        mutationFn: logout,

        onSuccess: (data) => {
            clearAuth();

            toast.success(data.message);

            navigate("/login", { replace: true });
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ??
                    "Logout failed."
            );
        },
    });
};