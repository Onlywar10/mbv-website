import { z } from "zod";

export const clientSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional().default(""),
	address: z.string().optional().default(""),
	city: z.string().optional().default(""),
	state: z.string().optional().default(""),
	zip: z.string().optional().default(""),
	notes: z.string().optional().default(""),
	isActive: z
		.string()
		.optional()
		.transform((v) => v === "on" || v === "true"),
	emailOptIn: z
		.string()
		.optional()
		.transform((v) => v === "on" || v === "true"),
});

export const clientRoleSchema = z.object({
	role: z.enum(["volunteer", "participant", "member", "donor"], {
		message: "Role is required",
	}),
});

export type ClientFormData = z.infer<typeof clientSchema>;
