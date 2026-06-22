import { Document, Types } from "mongoose";

export interface CreateSessionData {
    userId: string;

    sessionId: string;

    refreshTokenHash: string;

    userAgent?: string;

    ipAddress?: string;

    deviceInfo?: string;

    expiresAt: Date;
};

export interface ISession extends Document {
    user: Types.ObjectId;
    sessionId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    lastActivityAt: Date;
    isRevoked: boolean;
    revokedAt?: Date | null;
}

export interface RefreshPayload {
    id: string;
    sessionId: string;
    tokenVersion: number;
}