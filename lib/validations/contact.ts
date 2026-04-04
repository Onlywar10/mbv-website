import { z } from "zod";

/** Strip HTML tags to prevent injection into email templates. */
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, "");

export const contactFormSchema = z.object({
	name: z.string().min(1, "Name is required").transform(stripHtml),
	email: z.string().email("Please enter a valid email address"),
	phone: z.string().optional().transform((v) => v ? stripHtml(v) : v),
	subject: z.string().min(1, "Subject is required").transform(stripHtml),
	message: z.string().min(10, "Message must be at least 10 characters").transform(stripHtml),
});
