import { z } from "zod";

export const mailingListSchema = z.object({
	subject: z.string().min(1, "Subject is required"),
	body: z.string().min(1, "Message body is required"),
	attachmentUrls: z.string().optional(),
	attachmentNames: z.string().optional(),
	imageUrls: z.string().optional(),
	imageNames: z.string().optional(),
});
