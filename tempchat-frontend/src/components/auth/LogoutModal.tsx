import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout, logoutAllDevices } from "../../service/auth.service";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { disconnectSocket } from "../../service/socket.service";


interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LogoutModal = ({
    isOpen,
    onClose,
}: LogoutModalProps) => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const clearAuth = useAuthStore((state) => state.clearAuth);

    const finishLogout = (message: string) => {
        disconnectSocket();

        clearAuth();
        queryClient.clear();

        toast.success(message);

        onClose();

        navigate("/login", {
            replace: true,
        });
    };

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: (data) => {
            finishLogout(data.message);
        },
        onError: () => {
            toast.error("Logout failed");
        },
    });

    const logoutAllMutation = useMutation({
        mutationFn: logoutAllDevices,
        onSuccess: (data) => {
            finishLogout(data.message);
        },
        onError: () => {
            toast.error("Logout all devices failed");
        },
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Logout"
        >
            <div className="space-y-3">

                <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={
                        logoutMutation.isPending ||
                        logoutAllMutation.isPending
                    }
                    className="w-full rounded-lg bg-[#2a3942] px-4 py-3 text-left text-white transition hover:bg-red-700"
                >
                    Log out
                </button>

                <button
                    onClick={() => logoutAllMutation.mutate()}
                    disabled={
                        logoutMutation.isPending ||
                        logoutAllMutation.isPending
                    }
                    className="w-full rounded-lg bg-[#2a3942] px-4 py-3 text-left text-white transition hover:bg-red-700"
                >
                    Log out from all devices
                </button>

            </div>
        </Modal>
    );
};

export default LogoutModal;