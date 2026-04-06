import { z } from "zod";

export const teamMemberSchema = z.object({
	name: z.string().min(1, "Name is required"),
	title: z.string().min(1, "Title is required"),
	bio: z.string().min(1, "Bio is required"),
	imageUrl: z.string().url("Must be a valid image URL"),
	sortOrder: z.coerce.number().int().min(0).default(0),
});
