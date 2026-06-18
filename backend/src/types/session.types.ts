export interface CreateSessionData {
    userId: string;

    sessionId: string;

    refreshTokenHash: string;

    userAgent?: string;

    ipAddress?: string;

    deviceInfo?: string;

    expiresAt: Date;
};