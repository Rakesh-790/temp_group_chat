import { Worker } from "bullmq";
import redis from "../../config/redis.config";
import { processDeleteGroup } from "../processors/deleteGroup.processor";

export const deleteGroupWorker = new Worker(
    "delete-group",
    async (job) => {
        try {
            await processDeleteGroup(job.data);
        } catch (error) {
            console.error("Delete Group Job Failed: ", error);
            throw error;
        }
    },
    {
        connection: redis,
    }
);