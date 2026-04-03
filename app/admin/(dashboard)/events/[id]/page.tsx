import { CalendarDays, ChevronLeft, MapPin, Pencil, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryBadge, PublishBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPastVolunteersNotRegistered } from "@/lib/queries/email";
import { getEventById, getEventRegistrations, getRegistrationCount } from "@/lib/queries/events";
import { PendingApprovals } from "./pending-approvals";
import { RegisteredParticipants } from "./registered-participants";
import { VolunteerRecruitmentDialog } from "./volunteer-recruitment-dialog";

export const metadata: Metadata = {
	title: "Event Detail",
	robots: { index: false, follow: false },
};

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: PageProps) {
	const { id } = await params;
	const event = await getEventById(id);

	if (!event) notFound();

	const [registrations, regCount, pastVolunteers] = await Promise.all([
		getEventRegistrations(id),
		getRegistrationCount(id),
		event.volunteerEnabled ? getPastVolunteersNotRegistered(id) : Promise.resolve([]),
	]);

	const waitlisted = registrations.filter((r) => r.status === "waitlisted");
	const active = registrations.filter((r) => r.status !== "waitlisted" && r.status !== "cancelled");
	const cancelled = registrations.filter((r) => r.status === "cancelled");

	return (
		<div>
			{/* Header */}
			<Link
				href="/admin/events"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
			>
				<ChevronLeft className="h-4 w-4" />
				Back to Events
			</Link>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-heading text-2xl uppercase tracking-tight text-primary">
						{event.title}
					</h1>
					<div className="mt-2 flex flex-wrap items-center gap-3">
						<CategoryBadge category={event.category} />
						<PublishBadge isPublished={event.isPublished} />
						<span className="text-sm text-muted-foreground">
							{regCount} registration{regCount !== 1 ? "s" : ""}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{event.volunteerEnabled && (
						<VolunteerRecruitmentDialog
							eventId={id}
							volunteers={pastVolunteers}
						/>
					)}
					<Link
						href={`/admin/events/${id}/edit`}
						className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 font-heading text-sm uppercase tracking-wider text-cream transition-colors hover:bg-ink-soft"
					>
						<Pencil className="h-4 w-4" />
						Edit Event
					</Link>
				</div>
			</div>

			{/* Event Info Card */}
			<Card className="mt-6 rounded-sm ring-1 ring-border shadow-sharp">
				<CardContent className="pt-4">
					<div className="flex flex-wrap gap-6 text-sm">
						<div className="flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-rust" />
							<span>{event.date}</span>
							{event.time && <span className="text-muted-foreground">({event.time})</span>}
						</div>
						{event.location && (
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-rust" />
								<span>{event.location}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4 text-rust" />
							<span>
								{event.participantCapacity} participants / {event.volunteerCapacity} volunteers
								capacity, {regCount} registered
							</span>
						</div>
					</div>
					{event.description && (
						<p className="mt-3 text-sm text-muted-foreground">{event.description}</p>
					)}
				</CardContent>
			</Card>

			{/* Pending Approvals */}
			<Card className="mt-8 rounded-sm ring-1 ring-border shadow-sharp">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Pending Approvals
						{waitlisted.length > 0 && (
							<span className="rounded-full bg-ochre/10 px-2 py-0.5 text-xs font-semibold text-ochre">
								{waitlisted.length}
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<PendingApprovals registrations={waitlisted} eventId={id} />
				</CardContent>
			</Card>

			{/* Registered Participants */}
			<Card className="mt-8 rounded-sm ring-1 ring-border shadow-sharp">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-muted-foreground">
						Registered Participants
						{active.length > 0 && (
							<span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs font-semibold text-sage">
								{active.length}
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisteredParticipants registrations={active} eventId={id} />
				</CardContent>
			</Card>

			{/* Cancelled (collapsible, only show if any) */}
			{cancelled.length > 0 && (
				<Card className="mt-8 rounded-sm ring-1 ring-border shadow-sharp">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-muted-foreground">
							Cancelled
							<span className="rounded-full bg-rust/10 px-2 py-0.5 text-xs font-semibold text-rust">
								{cancelled.length}
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<RegisteredParticipants registrations={cancelled} eventId={id} />
					</CardContent>
				</Card>
			)}
		</div>
	);
}
