"use client";

import Image from "next/image";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { deleteGalleryImageAction } from "@/lib/actions/gallery";

type GalleryImage = {
	id: string;
	url: string;
	alt: string | null;
	sortOrder: number;
};

interface GalleryGridProps {
	images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
	if (images.length === 0) {
		return (
			<p className="py-12 text-center text-muted-foreground">
				No gallery images yet. Upload one above.
			</p>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{images.map((image) => (
				<div
					key={image.id}
					className="group relative overflow-hidden rounded-sm ring-1 ring-border"
				>
					<div className="relative aspect-square">
						<Image
							src={image.url}
							alt={image.alt ?? ""}
							fill
							className="object-cover"
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
						/>
					</div>
					<div className="flex items-center justify-between bg-cream px-3 py-2">
						<div className="min-w-0 flex-1">
							<p className="truncate text-xs text-muted-foreground">{image.alt || "No alt text"}</p>
							<p className="text-xs text-muted-foreground/60">Order: {image.sortOrder}</p>
						</div>
						<DeleteDialog
							title="this image"
							onConfirm={async () => {
								await deleteGalleryImageAction(image.id);
							}}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
