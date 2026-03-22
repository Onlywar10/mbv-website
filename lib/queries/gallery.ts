import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema/gallery-images";

export async function getGalleryImages() {
	return db
		.select()
		.from(galleryImages)
		.orderBy(asc(galleryImages.sortOrder), asc(galleryImages.createdAt));
}
