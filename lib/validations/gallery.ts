import { z } from "zod";

export const galleryImageSchema = z.object({
	url: z.string().url("Must be a valid image URL"),
	alt: z.string().optional().default(""),
	sortOrder: z.coerce.number().int().min(0).default(0),
});
