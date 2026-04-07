"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-images";
import { logger } from "@/lib/logger";
import type { ActionState } from "@/lib/types";
import { galleryImageSchema } from "@/lib/validations/gallery";

export async function createGalleryImageAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = galleryImageSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	try {
		await db.insert(galleryImages).values({
			url: data.url,
			alt: data.alt,
			sortOrder: data.sortOrder,
		});
	} catch (err) {
		logger.error("gallery", "Failed to create gallery image", {
			alt: data.alt,
			error: String(err),
		});
		return { error: "Failed to add image. Please try again." };
	}

	logger.info("gallery", "Gallery image added", { alt: data.alt });
	revalidatePath("/admin/gallery");
	revalidatePath("/");
	revalidatePath("/about");

	return { success: "Image added to gallery" };
}

export async function deleteGalleryImageAction(id: string): Promise<ActionState> {
	await requireAuth();

	const image = await db
		.select({ url: galleryImages.url })
		.from(galleryImages)
		.where(eq(galleryImages.id, id))
		.limit(1);

	if (image[0]?.url.includes("blob.vercel-storage.com")) {
		try {
			await del(image[0].url);
		} catch (err) {
			logger.warn("gallery", "Failed to delete gallery image blob", { id, error: String(err) });
		}
	}

	try {
		await db.delete(galleryImages).where(eq(galleryImages.id, id));
	} catch (err) {
		logger.error("gallery", "Failed to delete gallery image", { id, error: String(err) });
		return { error: "Failed to delete image. Please try again." };
	}

	logger.info("gallery", "Gallery image deleted", { id });
	revalidatePath("/admin/gallery");
	revalidatePath("/");
	revalidatePath("/about");

	return { success: "Image deleted" };
}
