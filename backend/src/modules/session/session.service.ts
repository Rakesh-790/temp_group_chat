import { CreateSessionData, ISession } from "../../types/session.types";
import { AppError } from "../../utils/AppError";
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
        throw new AppError(
            "Session not Found",
            404
        );
    };

    if (session.isRevoked == true) {
        throw new AppError(
            "Session revoked",
            401
        );
    };

    if (session.expiresAt < new Date()) {
        throw new AppError(
            "Session is Expired",
            401
        );
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

export const getUserSessions = async (userId: string) => {
    
    const sessions = await sessionModel.find({
        user: userId,
        isRevoked: false
    }).sort({ createdAt: -1 });

    return sessions
};

export const revokeSession = async (
    sessionId: string,
    userId: string
) => {

    const session = await sessionModel.findOne({
        _id: sessionId,
        user: userId,
        isRevoked: false
    });

    if (!session) {
        throw new AppError(
            'Session not found',
            404
        );
    }

    session.isRevoked = true;

    await session.save();

    return session;
};