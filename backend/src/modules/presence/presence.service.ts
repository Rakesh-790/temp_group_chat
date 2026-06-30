import redis from "../../config/redis.config";

const PRESENCE_PREFIX = "presence";

export const setUserOnline = async(userId: string) : Promise<void> => {
    
    const key = `${PRESENCE_PREFIX}:${userId}`;

    await redis.set(key, 'online');
};

export const setUserOffline = async(userId: string) : Promise<void> => {

    const key = `${PRESENCE_PREFIX}:${userId}`;

    await redis.del(key);
};

export const isUserOnline = async(userId: string) : Promise<boolean> => {
    
    const key = `${PRESENCE_PREFIX}:${userId}`;

    const exists = await redis.exists(key);

    return exists === 1;
};