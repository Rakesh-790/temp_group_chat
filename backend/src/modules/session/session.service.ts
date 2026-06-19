import { CreateSessionData, ISession } from "../../types/session.types";
import sessionModel from "./session.model";

export const createSession = async (sessionData: CreateSessionData) => {
    const session = await sessionModel.create({
        user: sessionData.userId,
        sessionId: sessionData.sessionId,
        refreshTokenHash: sessionData.refreshTokenHash,
        userAgent: sessionData.userAgent,
        ipAddress: sessionData.ipAddress,
        deviceInfo: sessionData.deviceInfo,
        expiresAt: sessionData.expiresAt
    });

    return session;
};

export const findValidSession = async (
    sessionId: string
): Promise<ISession> => {

    const session = await sessionModel.findOne({ sessionId });

    if (!session) {
        throw new Error("Session not Found");
    };

    if (session.isRevoked == true) {
        throw new Error("Session revoked");
    };

    if (session.expiresAt < new Date()) {
        throw new Error("Session is Expired");
    };

    return session;
};

export const rotateSessionToken = async (
    sessionId: string,
    refreshTokenHash: string,
    expiresAt: Date
): Promise<ISession | null> => {

    return sessionModel.findOneAndUpdate(
        {
            sessionId
        },
        {
            refreshTokenHash,
            expiresAt,
            lastActivityAt: new Date()
        },
        {
            new: true
        }
    );
};

export const invalidateSession = async (
    sessionId: string
): Promise<ISession | null> => {

    const session = await sessionModel.findOneAndUpdate(
        {
            sessionId,
            isRevoked: false
        },
        {
            isRevoked: true,
            revokedAt: new Date()
        },
        {
            new: true
        }
    );

    return session;
};