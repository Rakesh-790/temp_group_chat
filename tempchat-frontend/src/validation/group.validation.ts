import z from "zod";

export const createGroupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),

    description: z
        .string()
        .trim()
        .max(200, "Description cannot exceed 200 characters")
        .optional(),

    duration: z
        .number({
            error: "Duration is required",
        })
        .int("Duration must be a whole number")
        .min(1, "Duration must be at least 1 hour")
        .max(168, "Duration cannot exceed 168 hours (7 days)"),
});

export const joinGroupSchema = z.object({
    inviteCode: z
        .string()
        .trim()
        .min(1, "Invite code is required"),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;

export type JoinGroupFormData = z.infer<typeof joinGroupSchema>;