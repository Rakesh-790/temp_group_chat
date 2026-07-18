import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout, logoutAllDevices } from "../../service/auth.service";
import { useAuthStore } from "../../store/auth.store";

const Dashboard = () => {
    const navigate = useNavigate();

    const clearAuth = useAuthStore((state) => state.clearAuth);

    const handleLogout = async () => {
        try {
            const response = await logout();

            clearAuth();

            toast.success(response.message);

            navigate("/login", { replace: true });
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ?? "Logout failed."
            );
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            const response = await logoutAllDevices();

            clearAuth();

            toast.success(response.message);

            navigate("/login", { replace: true });
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                    "Logout from all devices failed."
            );
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-3xl font-bold">
                TempChat Dashboard
            </h1>

            <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white"
            >
                Logout
            </button>

            <button
                onClick={handleLogoutAllDevices}
                className="rounded bg-gray-700 px-4 py-2 text-white"
            >
                Logout All Devices
            </button>
        </div>
    );
};

export default Dashboard;