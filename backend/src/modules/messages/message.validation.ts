import { z } from "zod";
import { MessageType } from "./message.model";

export const attachmentSchema = z.object({
    url: z.string().url(),
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

    if(!hasContent && !hasAttachments){
        ctx.addIssue({
            code: "custom",
            message: "Message must contain either content or at least one attachment",
            path: ["content"]
        });
    }
});