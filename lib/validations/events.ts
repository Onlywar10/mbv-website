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
	participantCapacity: z.coerce.number().int().min(0, "Must be 0 or more").default(0),
	volunteerCapacity: z.coerce.number().int().min(0, "Must be 0 or more").default(0),
	volunteerEnabled: z
		.string()
		.optional()
		.transform((v) => v === "on" || v === "true"),
	volunteerDescription: z.string().optional().default(""),
	volunteerTime: z.string().optional().default(""),
	volunteerNotes: z.string().optional().default(""),
	isPublished: z
		.string()
		.optional()
		.transform((v) => v === "on" || v === "true"),
});

export const templateSchema = z.object({
	name: z.string().min(1, "Template name is required"),
	title: z.string().min(1, "Title is required"),
	location: z.string().optional().default(""),
	category: z.enum(["fishing", "whale-watching", "volunteer", "community", "derby"], {
		message: "Category is required",
	}),
	description: z.string().optional().default(""),
	longDescription: z.string().optional().default(""),
	imageUrl: z.string().optional().default(""),
	accessibility: z.string().optional().default(""),
	defaultSpots: z.coerce.number().int().min(0).default(0),
});
