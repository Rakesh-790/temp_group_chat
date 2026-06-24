import { z } from 'zod';

export const createGroupSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(3, 'Group name must be at least 3 characters')
            .max(50, 'Group name cannot exceed 50 characters'),

        description: z
            .string()
            .trim()
            .max(200, 'Description cannot exceed 200 characters')
            .optional(),

        duration: z
            .number()
            .int()
            .min(1, 'Duration must be at least 1 hour')
            .max(168, 'Duration cannot exceed 168 hours (7 days)')
    })
});


export const joinGroupSchema = z.object({
    body: z.object({
        inviteCode: z
            .string()
            .trim()
            .min(1, 'Invite code is required')
    })
});


export const inviteUserSchema = z.object({
    body: z.object({
        userId: z
            .string()
            .trim()
            .min(1, 'User id is required')
    })
});