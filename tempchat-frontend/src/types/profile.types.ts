export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatar: Avatar | null;
    bio: string;
    status: "Online" | "Invisible";
    isOnline: boolean;
    lastSeen: string | null;
};

export interface GetProfileResponse {
    success: boolean;
    message: string;
    profile: UserProfile;
};

interface Avatar {
    key: string;
    url: string;
};

export interface ProfileAvatarProps {
    username: string;
    avatar: string | null;
    onFileSelect?: (file: File) => void;
};