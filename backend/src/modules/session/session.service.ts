import { CreateSessionData } from "../../types/session.types";
import sessionModel from "./session.model";

export const createSession = async(sessionData : CreateSessionData) => {
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