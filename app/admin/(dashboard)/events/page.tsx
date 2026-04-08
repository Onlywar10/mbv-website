import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
	getEvents,
	getEventTemplates,
	getRegistrationCountsByEvent,
	getWaitlistedCountsByEvent,
} from "@/lib/queries/events";
import { EventFilterBar } from "./event-filter-bar";
import { TemplatesDialog } from "./templates-dialog";

export const metadata: Metadata = {
	title: "Manage Events",
	robots: { index: false, follow: false },
};

export default async function EventsPage() {
	const [events, templates, registrationCounts, waitlistedCounts] = await Promise.all([
		getEvents(),
		getEventTemplates(),
		getRegistrationCountsByEvent(),
		getWaitlistedCountsByEvent(),
	]);

	return (
		<div>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">Events</h1>
					<p className="mt-1 text-sm text-muted-foreground">{events.length} total events</p>
				</div>
				<div className="flex items-center gap-3">
					<TemplatesDialog templates={templates} />
					<Link
						href="/admin/events/new"
						className="inline-flex items-center gap-2 rounded-sm bg-rust px-4 py-2 font-heading text-sm uppercase tracking-wider text-cream transition-colors hover:bg-rust-light"
					>
						<Plus className="h-4 w-4" />
						New Event
					</Link>
				</div>
			</div>

			<div className="mt-6">
				<EventFilterBar
					events={events}
					registrationCounts={registrationCounts}
					waitlistedCounts={waitlistedCounts}
				/>
			</div>
		</div>
	);
}
