import { z } from "zod";

export const eventSchema = z.object({
	title: z.string().min(1, "Title is required"),
	date: z.string().min(1, "Date is required"),
	time: z.string().optional().default(""),
	location: z.string().optional().default(""),
	category: z.enum(["fishing", "whale-watching", "volunteer", "community", "derby"], {
		message: "Category is required",
	}),
	description: z.string().optional().default(""),
	longDescription: z.string().optional().default(""),
	imageUrl: z.string().optional().default(""),
	accessibility: z.string().optional().default(""),
	spotsAvailable: z.coerce.number().int().min(0, "Must be 0 or more").default(0),
	isPublished: z
		.string()
		.optional()
		.transform((v) => v === "on" || v === "true"),
});

export type EventFormData = z.infer<typeof eventSchema>;
