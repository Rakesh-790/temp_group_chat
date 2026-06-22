export interface UpdateProfileDTO{
    username?: string,
    bio?: string,
    status?: 'Online' | 'Invisible';
};

export interface UserProfileResponse{
    id: string,
    username: string,
    email: string,
    avatar: string | null,
    bio: string,
    status: 'Online' | 'Invisible',
    isOnline: boolean,
    lastSeen: Date | null;
}