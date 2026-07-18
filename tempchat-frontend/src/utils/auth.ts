import { useAuthStore } from "../store/auth.store";

export const PUBLIC_AUTH_ROUTES = ["/login", "/register"] as const;

export const isPublicAuthRoute = (pathname: string): boolean =>
    PUBLIC_AUTH_ROUTES.includes(pathname as (typeof PUBLIC_AUTH_ROUTES)[number]);

export const logoutUser = (): void => {
    useAuthStore.getState().clearAuth();

    if (!isPublicAuthRoute(window.location.pathname)) {
        window.location.href = "/login";
    }
};
