"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/form-field";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { createGalleryImageAction } from "@/lib/actions/gallery";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function GalleryUploadForm() {
	const [state, formAction, isPending] = useActionState(createGalleryImageAction, initialState);

	return (
		<form action={formAction} className="space-y-4">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-2 text-sm text-sage">{state.success}</div>
			)}

			<ImageUpload name="url" label="Image" />

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField name="alt" label="Alt Text" required placeholder="Describe the image..." />
				<FormField name="sortOrder" label="Sort Order" type="number" defaultValue={0} />
			</div>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Adding..." : "Add to Gallery"}
			</Button>
		</form>
	);
}
