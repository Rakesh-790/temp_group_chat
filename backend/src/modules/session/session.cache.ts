import redis from "../../config/redis.config";
import sessionModel from "./session.model";
import { ISession } from "./session.types";

const SESSION_CACHE_PREFIX = "session";

const getSessionCacheKey = (sessionId: string): string => {
    return `${SESSION_CACHE_PREFIX}:${sessionId}`;
};

export const getCachedSession = async (
    sessionId: string
): Promise<InstanceType<typeof sessionModel> | null> => {

    const cacheKey = getSessionCacheKey(sessionId);

    const cachedSession = await redis.get(cacheKey);

    if (!cachedSession) {
        return null;
    }

    return JSON.parse(cachedSession);
};

export const cachedSession = async (
    session: ISession
): Promise<void> => {

    const cacheKey = getSessionCacheKey(session.sessionId);

    const ttlInSeconds = Math.max(
        0,
        Math.floor(new Date(session.expiresAt).getTime() - Date.now()) / 1000
    );

    if (ttlInSeconds <= 0) {
        return;
    };

    await redis.set(
        cacheKey,
        JSON.stringify(session),
        "EX",
        ttlInSeconds
    );
};

export const deleteCachedSession = async (
    sessionId: string
): Promise<void> => {
    const cacheKey = getSessionCacheKey(sessionId);
    await redis.del(cacheKey);
};