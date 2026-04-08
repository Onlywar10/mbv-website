import { z } from "zod";

/** Strip HTML tags to prevent injection into email templates. */
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, "");

export const eventSignupSchema = z.object({
	eventId: z.string().min(1, "Please select an event"),
	firstName: z.string().min(1, "First name is required").transform(stripHtml),
	lastName: z.string().min(1, "Last name is required").transform(stripHtml),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required").transform(stripHtml),
	emailOptIn: z
		.string()
		.optional()
		.transform((v) => v === "on"),
	hasGuest: z
		.string()
		.optional()
		.transform((v) => v === "on"),
	guestFirstName: z.string().optional().default("").transform(stripHtml),
	guestLastName: z.string().optional().default("").transform(stripHtml),
	guestEmail: z.string().optional().default(""),
	guestPhone: z.string().optional().default("").transform(stripHtml),
});
