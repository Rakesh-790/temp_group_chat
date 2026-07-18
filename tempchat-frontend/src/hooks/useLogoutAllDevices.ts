import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logoutAllDevices } from "../service/auth.service";
import { useAuthStore } from "../store/auth.store";

export const useLogoutAllDevices = () => {
    const navigate = useNavigate();

    const clearAuth = useAuthStore((state) => state.clearAuth);

    return useMutation({
        mutationFn: logoutAllDevices,

        onSuccess: (data) => {
            clearAuth();

            toast.success(data.message);

            navigate("/login", { replace: true });
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ??
                    "Logout from all devices failed."
            );
        },
    });
};