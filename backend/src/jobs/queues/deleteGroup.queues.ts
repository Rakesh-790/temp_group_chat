import { Queue } from "bullmq";
import redis from "../../config/redis.config";

export const deleteGroupQueue = new Queue("delete-group", {
    connection: redis,
});

export const addDeleteGroupJob = async (
    groupId: string,
    expiresAt: Date
) => {

    const delay = expiresAt.getTime() - Date.now();

    await deleteGroupQueue.add(
        "delete-expired-group",
        { groupId },
        {
            delay,
            removeOnComplete: true,
            removeOnFail: false
        }
    );
};