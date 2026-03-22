"use client";

import { FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FormField } from "@/components/admin/form-field";
import { ImageUpload } from "@/components/admin/image-upload";
import { CategoryBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createTemplateAction, deleteTemplateAction } from "@/lib/actions/events";
import type { ActionState } from "@/lib/types";

type Template = {
	id: string;
	name: string;
	title: string;
	category: string;
	defaultSpots: number;
};

interface TemplatesDialogProps {
	templates: Template[];
}

const categories = [
	{ value: "fishing", label: "Fishing" },
	{ value: "whale-watching", label: "Whale Watching" },
	{ value: "volunteer", label: "Volunteer" },
	{ value: "community", label: "Community" },
	{ value: "derby", label: "Derby" },
];

const initialState: ActionState = {};

export function TemplatesDialog({ templates }: TemplatesDialogProps) {
	const [open, setOpen] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [state, formAction, isPending] = useActionState(createTemplateAction, initialState);

	if (!open) {
		return (
			<Button
				variant="outline"
				onClick={() => setOpen(true)}
				className="gap-2 font-heading uppercase"
			>
				<FileText className="h-4 w-4" />
				Templates ({templates.length})
			</Button>
		);
	}

	return (
		<div className="rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Event Templates
				</h2>
				<div className="flex gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowForm(!showForm)}
						className="gap-1 font-heading uppercase text-xs"
					>
						<Plus className="h-3 w-3" />
						{showForm ? "Cancel" : "New Template"}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setOpen(false)}
						className="font-heading uppercase text-xs"
					>
						Close
					</Button>
				</div>
			</div>

			{showForm && (
				<form action={formAction} className="mb-6 space-y-3 border-b border-border pb-6">
					{state.error && (
						<div className="rounded-sm bg-rust/10 px-3 py-2 text-sm text-rust">{state.error}</div>
					)}
					{state.success && (
						<div className="rounded-sm bg-sage/10 px-3 py-2 text-sm text-sage">{state.success}</div>
					)}
					<div className="grid gap-3 sm:grid-cols-2">
						<FormField
							name="name"
							label="Template Name"
							required
							placeholder="e.g. Monthly Fishing Trip"
						/>
						<FormField name="title" label="Event Title" required placeholder="e.g. Rockfish Trip" />
					</div>
					<div className="grid gap-3 sm:grid-cols-3">
						<FormField name="location" label="Location" placeholder="e.g. Monterey Harbor" />
						<div className="space-y-1">
							<Label className="font-heading text-xs uppercase tracking-wider">Category</Label>
							<select
								name="category"
								required
								className="flex h-9 w-full rounded-sm border border-input bg-background px-3 py-1 text-sm"
							>
								{categories.map((c) => (
									<option key={c.value} value={c.value}>
										{c.label}
									</option>
								))}
							</select>
						</div>
						<FormField name="defaultSpots" label="Default Spots" type="number" defaultValue={0} />
					</div>
					<ImageUpload name="imageUrl" label="Template Image" />
					<Button
						type="submit"
						disabled={isPending}
						size="sm"
						className="bg-rust font-heading text-xs uppercase text-cream hover:bg-rust-light"
					>
						{isPending ? "Creating..." : "Create Template"}
					</Button>
				</form>
			)}

			{templates.length === 0 ? (
				<p className="text-sm text-muted-foreground">No templates yet. Create one above.</p>
			) : (
				<div className="space-y-2">
					{templates.map((t) => (
						<div
							key={t.id}
							className="flex items-center justify-between rounded-sm border border-border px-4 py-3"
						>
							<div className="flex items-center gap-3">
								<div>
									<span className="text-sm font-medium text-primary">{t.name}</span>
									<span className="ml-2 text-xs text-muted-foreground">({t.title})</span>
								</div>
								<CategoryBadge category={t.category} />
								<span className="text-xs text-muted-foreground">{t.defaultSpots} spots</span>
							</div>
							<div className="flex items-center gap-2">
								<Link
									href={`/admin/events/new?templateId=${t.id}`}
									className="rounded-sm bg-ink px-3 py-1 font-heading text-xs uppercase text-cream hover:bg-ink-soft"
								>
									Use
								</Link>
								<form
									action={async () => {
										await deleteTemplateAction(t.id);
									}}
								>
									<button
										type="submit"
										className="rounded-sm p-1 text-muted-foreground hover:text-rust"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</form>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
