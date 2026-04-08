import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/events";
import { getEventTemplateById } from "@/lib/queries/events";
import { EventForm } from "../event-form";

export const metadata: Metadata = {
	title: "Create Event",
	robots: { index: false, follow: false },
};

type PageProps = {
	searchParams: Promise<{ templateId?: string }>;
};

export default async function NewEventPage({ searchParams }: PageProps) {
	const { templateId } = await searchParams;

	let defaultValues: Record<string, unknown> | undefined;

	if (templateId) {
		const template = await getEventTemplateById(templateId);
		if (template) {
			defaultValues = {
				title: template.title,
				location: template.location ?? "",
				category: template.category,
				description: template.description ?? "",
				longDescription: template.longDescription ?? "",
				imageUrl: template.imageUrl ?? "",
				accessibility: template.accessibility ?? "",
				participantCapacity: template.defaultSpots,
			};
		}
	}

	return (
		<div>
			<Link
				href="/admin/events"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Events
			</Link>

			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
				{templateId ? "Create Event from Template" : "Create Event"}
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">Fill in the event details below</p>

			<div className="mt-6 max-w-2xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<EventForm action={createEventAction} defaultValues={defaultValues} />
			</div>
		</div>
	);
}
