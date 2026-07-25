import api from "../api/axios";
import type { GetProfileResponse } from "../types/profile.types";

export const getProfile = async () => {
    const response = await api.get<GetProfileResponse>(
        "/users/profile"
    );

    return response.data.profile;
};

export const uploadAvatar = async (file: File) => {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await api.patch(
        "/users/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export interface UpdateProfilePayload {
    username: string;
    bio: string;
};

export const updateProfile = async (
    data: UpdateProfilePayload
) => {
    const response = await api.patch(
        "/users/profile",
        data
    );

    return response.data;
};