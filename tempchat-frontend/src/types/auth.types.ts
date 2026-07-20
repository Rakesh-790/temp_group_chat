export interface Avatar {
    url: string | null;
    key: string | null;
};

export interface User {
    id: string;
    username: string;
    email: string;
    role: "user" | "admin" | "owner";

    avatar: Avatar;

    bio: string;
    status: "Online" | "Invisible";

    isOnline: boolean;
    lastSeen: string | null;

    createdAt: string;
    updatedAt: string;
};

export interface RegisterData {
    username: string;
    email: string;
    password: string;
};

export interface LoginData {
    email: string;
    password: string;
};

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
};

export interface MessageResponse {
    success: boolean;
    message: string;
};

export interface ProfileResponse {
    success: boolean;
    message: string;
    profile: User;
}