import mongoose from "mongoose";
import { z } from "zod";

const groupIdParamsSchema = z.object({
    groupId: z.string().refine(
        value => mongoose.Types.ObjectId.isValid(value),
        {
            message: "Invalid group id"
        }
    )
});

const groupDetailsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),

    description: z
        .string()
        .trim()
        .max(200, "Description cannot exceed 200 characters")
        .optional()
});

export const createGroupSchema = z.object({
    body: groupDetailsSchema.extend({
        duration: z
            .number()
            .int()
            .min(1, "Duration must be at least 1 hour")
            .max(168, "Duration cannot exceed 168 hours (7 days)")
    })
});

export const updateGroupSchema = z.object({
    params: groupIdParamsSchema,

    body: groupDetailsSchema
        .partial()
        .refine(
            data =>
                data.name !== undefined ||
                data.description !== undefined,
            {
                message: "At least one field must be provided."
            }
        )
});

export const updateGroupAvatarSchema = z.object({
    params: groupIdParamsSchema
});

export const joinGroupSchema = z.object({
    body: z.object({
        inviteCode: z
            .string()
            .trim()
            .min(1, "Invite code is required")
    })
});

export const assignRoleSchema = z.object({
    params: groupIdParamsSchema,

    body: z.object({
        userId: z
            .string()
            .trim()
            .min(1, "User id is required"),

        role: z.enum([
            "OWNER",
            "ADMIN",
            "MEMBER"
        ])
    })
});

export const deleteGroupSchema = z.object({
    params: groupIdParamsSchema
});