export interface LoginData {

    email: string;

    password: string;

    ipAddress?: string;

    userAgent?: string;

    deviceInfo?: string;

};

export interface LoginResponse {

    user: any;

    accessToken: string;

    refreshToken: string;

};

export interface RegisterData {

    username: string;

    email: string;

    password: string;

    ipAddress?: string;

    userAgent?: string;

    deviceInfo?: string;
};