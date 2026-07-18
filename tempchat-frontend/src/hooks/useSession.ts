import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../service/auth.service";
import { useAuthStore } from "../store/auth.store";
import { isPublicAuthRoute } from "../utils/auth";

const useSession = () => {
    const location = useLocation();
    const setUser = useAuthStore((state) => state.setUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        if (isPublicAuthRoute(location.pathname)) {
            setLoading(false);
            return;
        }

        const restoreSession = async () => {
            try {
                const response = await getProfile();

                setUser(response.profile);
            } catch {
                clearAuth();
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [location.pathname, setUser, clearAuth, setLoading]);
};

export default useSession;
