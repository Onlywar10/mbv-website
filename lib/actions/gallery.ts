"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-images";
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

	await db.insert(galleryImages).values({
		url: data.url,
		alt: data.alt,
		sortOrder: data.sortOrder,
	});

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
		await del(image[0].url);
	}

	await db.delete(galleryImages).where(eq(galleryImages.id, id));

	revalidatePath("/admin/gallery");
	revalidatePath("/");
	revalidatePath("/about");

	return { success: "Image deleted" };
}
