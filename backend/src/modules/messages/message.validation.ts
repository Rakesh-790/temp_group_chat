import { z } from "zod";
import { MessageType } from "./message.model";
import mongoose from "mongoose";

export const isValidObjectId = (value: string): boolean => {
    return mongoose.Types.ObjectId.isValid(value);
};

export const attachmentSchema = z.object({
    url: z.url(),
    key: z.string().min(1),
    fileName: z.string().min(1),
    mimeType: z.string().min(1),
    size: z.number().positive()
});

export const sendMessageSchema = z.object({
    groupId: z.string().trim().min(1, "Group ID is required"),

    type: z.enum(MessageType).default(MessageType.TEXT),

    content: z.string().trim().max(5000, "Message content cannot exceed 5000 charecters").optional(),

    attachments: z.array(attachmentSchema).default([]),

    replyTo: z.string().trim().optional()

}).superRefine((data, ctx) => {
    const hasContent = !!data.content?.trim();
    const hasAttachments = data.attachments.length > 0;

    if (!hasContent && !hasAttachments) {
        ctx.addIssue({
            code: "custom",
            message: "Message must contain either content or at least one attachment.",
            path: ["content"]
        });
    };
});

export const markMessageReadSchema = z.object({
    groupId: z
        .string()
        .trim()
        .refine(isValidObjectId, {
            error: "Invalid group id"
        }),
    messageIds: z
        .array(
            z.string()
                .trim()
                .refine(
                    isValidObjectId, {
                    error: "Invalid message id"
                }))
        .min(1, { error: "At Least one message ID is required" })
        .refine(
            ids => new Set(ids).size === ids.length,
            {
                error: "duplicate messageIds are not allowed."
            }
        )
});