import { z } from "zod";

export const galleryImageSchema = z.object({
	url: z.string().min(1, "Image is required"),
	alt: z.string().optional().default(""),
	sortOrder: z.coerce.number().int().min(0).default(0),
});
