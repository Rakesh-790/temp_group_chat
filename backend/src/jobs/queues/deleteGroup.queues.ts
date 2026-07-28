import { Queue } from "bullmq";
import redis from "../../config/redis.config";

export const deleteGroupQueue = new Queue("delete-group", {
    connection: redis,
});

export const addDeleteGroupJob = async (
    groupId: string,
    deleteAt: Date
) => {

    const delay = deleteAt.getTime() - Date.now();

    const existingJob = await deleteGroupQueue.getJob(groupId);

    if (existingJob) {
        await existingJob.remove();
    };

    await deleteGroupQueue.add(
        "delete-expired-group",
        { groupId },
        {
            jobId: groupId,
            delay,
            removeOnComplete: true,
            removeOnFail: false
        }
    );
};