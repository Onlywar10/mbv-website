"use client";

import { useActionState, useState } from "react";
import { FormField } from "@/components/admin/form-field";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/types";

const categories = [
	{ value: "fishing", label: "Fishing" },
	{ value: "whale-watching", label: "Whale Watching" },
	{ value: "volunteer", label: "Volunteer" },
	{ value: "community", label: "Community" },
	{ value: "derby", label: "Derby" },
];

interface EventFormProps {
	action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
	defaultValues?: {
		title?: string;
		date?: string;
		time?: string;
		location?: string;
		category?: string;
		description?: string;
		longDescription?: string;
		imageUrl?: string;
		accessibility?: string;
		participantCapacity?: number;
		volunteerCapacity?: number;
		volunteerEnabled?: boolean;
		volunteerDescription?: string;
		volunteerTime?: string;
		volunteerNotes?: string;
		isPublished?: boolean;
	};
	submitLabel?: string;
}

const initialState: ActionState = {};

export function EventForm({ action, defaultValues, submitLabel = "Create Event" }: EventFormProps) {
	const [state, formAction, isPending] = useActionState(action, initialState);
	const [volunteerEnabled, setVolunteerEnabled] = useState(
		defaultValues?.volunteerEnabled ?? false,
	);

	return (
		<form action={formAction} className="space-y-6">
			{state.error && (
				<div className="rounded-sm bg-rust/10 px-4 py-3 text-sm text-rust">{state.error}</div>
			)}
			{state.success && (
				<div className="rounded-sm bg-sage/10 px-4 py-3 text-sm text-sage">{state.success}</div>
			)}

			<div className="grid gap-6 sm:grid-cols-2">
				<FormField name="title" label="Title" defaultValue={defaultValues?.title} required />
				<FormField
					name="date"
					label="Date"
					type="date"
					defaultValue={defaultValues?.date}
					required
				/>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<FormField
					name="time"
					label="Time"
					defaultValue={defaultValues?.time}
					placeholder="e.g. 6:00 AM - 2:00 PM"
				/>
				<FormField
					name="location"
					label="Location"
					defaultValue={defaultValues?.location}
					placeholder="e.g. Monterey Harbor"
				/>
			</div>

			<div className="grid gap-6 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="field-category" className="font-heading text-xs uppercase tracking-wider">
						Category <span className="text-rust">*</span>
					</Label>
					<select
						id="field-category"
						name="category"
						defaultValue={defaultValues?.category ?? "fishing"}
						required
						className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
					>
						{categories.map((c) => (
							<option key={c.value} value={c.value}>
								{c.label}
							</option>
						))}
					</select>
				</div>
				<FormField
					name="participantCapacity"
					label="Participant Capacity"
					type="number"
					defaultValue={defaultValues?.participantCapacity ?? 0}
				/>
			</div>

			<FormField
				name="description"
				label="Short Description"
				defaultValue={defaultValues?.description}
				textarea
				placeholder="Brief description for event cards"
			/>

			<FormField
				name="longDescription"
				label="Full Description"
				defaultValue={defaultValues?.longDescription}
				textarea
				placeholder="Detailed event description"
			/>

			<ImageUpload name="imageUrl" label="Event Image" currentUrl={defaultValues?.imageUrl} />

			<FormField
				name="accessibility"
				label="Accessibility Info"
				defaultValue={defaultValues?.accessibility}
				textarea
				placeholder="ADA and accessibility details"
			/>

			{/* Volunteer Section */}
			<div className="rounded-sm border border-ochre/30 bg-ochre/5 p-5 space-y-5">
				<div className="flex items-center gap-3">
					<input
						type="checkbox"
						id="field-volunteerEnabled"
						name="volunteerEnabled"
						value="on"
						checked={volunteerEnabled}
						onChange={(e) => setVolunteerEnabled(e.target.checked)}
						className="h-4 w-4 rounded-sm border-border"
					/>
					<Label
						htmlFor="field-volunteerEnabled"
						className="font-heading text-sm uppercase tracking-wider text-ochre"
					>
						Enable Volunteering for This Event
					</Label>
				</div>

				{volunteerEnabled && (
					<div className="space-y-5">
						<div className="grid gap-6 sm:grid-cols-2">
							<FormField
								name="volunteerCapacity"
								label="Volunteers Needed"
								type="number"
								defaultValue={defaultValues?.volunteerCapacity ?? 0}
							/>
							<FormField
								name="volunteerTime"
								label="Volunteer Arrival Time"
								defaultValue={defaultValues?.volunteerTime}
								placeholder="e.g. 5:00 AM (1 hour before event)"
							/>
						</div>

						<FormField
							name="volunteerDescription"
							label="Volunteer Role Description"
							defaultValue={defaultValues?.volunteerDescription}
							textarea
							placeholder="What will volunteers be doing? e.g. Setting up equipment, guiding participants, etc."
						/>

						<FormField
							name="volunteerNotes"
							label="Volunteer Notes"
							defaultValue={defaultValues?.volunteerNotes}
							textarea
							placeholder="Extra notes for volunteers. e.g. Wear comfortable shoes, bring sunscreen, etc."
						/>
					</div>
				)}
			</div>

			<div className="flex items-center gap-3">
				<input
					type="checkbox"
					id="field-isPublished"
					name="isPublished"
					value="on"
					defaultChecked={defaultValues?.isPublished}
					className="h-4 w-4 rounded-sm border-border"
				/>
				<Label
					htmlFor="field-isPublished"
					className="font-heading text-xs uppercase tracking-wider"
				>
					Publish immediately
				</Label>
			</div>

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
