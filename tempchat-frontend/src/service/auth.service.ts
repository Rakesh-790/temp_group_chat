import api from "../api/axios";
import type { AuthResponse, LoginData, MessageResponse, ProfileResponse, RegisterData } from "../types/auth.types";

export const registerUser = async (
    data: RegisterData
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/register",
        data
    );

    return response.data;
};

export const loginUser = async (
    data: LoginData
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
};

export const getProfile =
    async (): Promise<ProfileResponse> => {
        const response = await api.get("/users/profile");

        return response.data;
    };

export const refreshAccessToken =
    async (): Promise<void> => {
        await api.post("/auth/refresh");
    };

export const logout =
    async (): Promise<MessageResponse> => {
        const response = await api.post<MessageResponse>("/auth/logout");

        return response.data;
    };

export const logoutAllDevices =
    async (): Promise<MessageResponse> => {
        const response = await api.post<MessageResponse>(
            "/auth/logoutAll"
        );

        return response.data;
    };