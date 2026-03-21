import { z } from "zod";

export const eventSignupSchema = z.object({
	eventId: z.string().min(1, "Please select an event"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	guestCount: z.coerce.number().int().min(0, "Must be 0 or more").default(0),
});

export const volunteerSignupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
});
