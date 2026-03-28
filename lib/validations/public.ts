import { z } from "zod";

export const eventSignupSchema = z.object({
	eventId: z.string().min(1, "Please select an event"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	emailOptIn: z
		.string()
		.optional()
		.transform((v) => v === "on"),
	hasGuest: z
		.string()
		.optional()
		.transform((v) => v === "on"),
	guestFirstName: z.string().optional().default(""),
	guestLastName: z.string().optional().default(""),
	guestEmail: z.string().optional().default(""),
	guestPhone: z.string().optional().default(""),
});

export const volunteerSignupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	emailOptIn: z
		.string()
		.optional()
		.transform((v) => v === "on"),
});
