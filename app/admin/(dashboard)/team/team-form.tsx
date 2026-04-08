"use client";

import { useActionState } from "react";
import { FormField } from "@/components/admin/form-field";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/types";

interface TeamFormProps {
	action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
	defaultValues?: {
		name?: string;
		title?: string;
		bio?: string;
		imageUrl?: string;
		sortOrder?: number;
	};
	submitLabel?: string;
}

const initialState: ActionState = {};

export function TeamForm({ action, defaultValues, submitLabel = "Add Member" }: TeamFormProps) {
	const [state, formAction, isPending] = useActionState(action, initialState);

	return (
		<form action={formAction} className="space-y-4">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-2 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-2 text-sm text-sage">{state.success}</div>
			)}

			<ImageUpload name="imageUrl" label="Photo" currentUrl={defaultValues?.imageUrl} />

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					name="name"
					label="Name"
					required
					defaultValue={defaultValues?.name}
					placeholder="Full name"
				/>
				<FormField
					name="title"
					label="Title / Role"
					required
					defaultValue={defaultValues?.title}
					placeholder="e.g. Board Member"
				/>
			</div>

			<FormField
				name="bio"
				label="Bio"
				required
				textarea
				defaultValue={defaultValues?.bio}
				placeholder="Short description..."
			/>

			<FormField
				name="sortOrder"
				label="Sort Order"
				type="number"
				defaultValue={defaultValues?.sortOrder ?? 0}
			/>

			<Button
				type="submit"
				disabled={isPending}
				className="bg-rust font-heading uppercase text-cream hover:bg-rust-light"
			>
				{isPending ? "Saving..." : submitLabel}
			</Button>
		</form>
	);
}
