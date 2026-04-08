"use client";

import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { deleteTemplateAction } from "@/lib/actions/events";

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

export function TemplatesDialog({ templates }: TemplatesDialogProps) {
	const [open, setOpen] = useState(false);

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
			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
					Event Templates
				</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setOpen(false)}
					className="font-heading text-xs uppercase"
				>
					Close
				</Button>
			</div>

			<p className="mb-4 text-xs text-muted-foreground">
				Save any event as a template from its detail page, then use it here to quickly create new
				events.
			</p>

			{templates.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No templates yet. Open an event and click &quot;Save as Template&quot; to create one.
				</p>
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
