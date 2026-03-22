import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/queries/gallery";
import { GalleryGrid } from "./gallery-grid";
import { GalleryUploadForm } from "./gallery-upload-form";

export const metadata: Metadata = {
	title: "Manage Gallery",
	robots: { index: false, follow: false },
};

export default async function GalleryPage() {
	const images = await getGalleryImages();

	return (
		<div>
			<div>
				<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Gallery</h1>
				<p className="mt-1 text-sm text-muted-foreground">{images.length} images</p>
			</div>

			<div className="mt-6 max-w-xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Upload Image
				</h2>
				<GalleryUploadForm />
			</div>

			<div className="mt-8">
				<h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
					All Images ({images.length})
				</h2>
				<GalleryGrid images={images} />
			</div>
		</div>
	);
}
