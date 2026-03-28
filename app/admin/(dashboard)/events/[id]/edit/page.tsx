import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateEventAction } from "@/lib/actions/events";
import { getEventById } from "@/lib/queries/events";
import { EventForm } from "../../event-form";

export const metadata: Metadata = {
	title: "Edit Event",
	robots: { index: false, follow: false },
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: PageProps) {
	const { id } = await params;
	const event = await getEventById(id);

	if (!event) notFound();

	const boundAction = updateEventAction.bind(null, id);

	return (
		<div>
			<Link
				href="/admin/events"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Events
			</Link>

			<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Edit Event</h1>
			<p className="mt-1 text-sm text-muted-foreground">{event.title}</p>

			<div className="mt-6 max-w-2xl rounded-sm bg-cream p-6 ring-1 ring-border shadow-sharp">
				<EventForm
					action={boundAction}
					defaultValues={{
						title: event.title,
						date: event.date,
						time: event.time ?? "",
						location: event.location ?? "",
						category: event.category,
						description: event.description ?? "",
						longDescription: event.longDescription ?? "",
						imageUrl: event.imageUrl ?? "",
						accessibility: event.accessibility ?? "",
						participantCapacity: event.participantCapacity,
						volunteerCapacity: event.volunteerCapacity,
						volunteerEnabled: event.volunteerEnabled,
						volunteerDescription: event.volunteerDescription ?? "",
						volunteerTime: event.volunteerTime ?? "",
						volunteerNotes: event.volunteerNotes ?? "",
						waiverRequired: event.waiverRequired,
						isPublished: event.isPublished,
					}}
					submitLabel="Save Changes"
				/>
			</div>
		</div>
	);
}
