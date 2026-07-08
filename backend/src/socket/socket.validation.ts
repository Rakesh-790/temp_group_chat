import { z } from "zod";

export const joinRoomSchema = z.object({
    roomId: z.string().min(1, "Room id is required")
});

export const leaveRoomSchema = z.object({
    roomId: z.string().min(1, "Room id is required")
});