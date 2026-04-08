"use client";

import { CalendarDays, Eye, EyeOff, MapPin, Pencil, Trash2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReasonDialog } from "@/components/admin/reason-dialog";
import { CategoryBadge, PublishBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteEventAction, togglePublishAction } from "@/lib/actions/events";

type AdminEvent = {
	id: string;
	title: string;
	slug: string;
	date: string;
	time: string | null;
	location: string | null;
	category: string;
	imageUrl: string | null;
	description: string | null;
	participantCapacity: number;
	isPublished: boolean;
};

interface AdminEventCardProps {
	event: AdminEvent;
	participantCount: number;
	waitlistedCount: number;
}

export function AdminEventCard({ event, participantCount, waitlistedCount }: AdminEventCardProps) {
	const spotsLeft = Math.max(0, event.participantCapacity - participantCount);

	return (
		<Card className="flex h-full flex-col overflow-hidden rounded-sm bg-cream pt-0 ring-1 ring-border transition-shadow hover:shadow-sharp">
			<div className="relative aspect-[16/10] overflow-hidden">
				<Image
					src={event.imageUrl || "/images/hero/MBV-Boat.png"}
					alt={event.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<div className="absolute top-3 left-3 flex gap-2">
					<CategoryBadge category={event.category} />
					<PublishBadge isPublished={event.isPublished} />
				</div>
			</div>

			<CardHeader className="pb-0">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CalendarDays className="h-4 w-4 shrink-0 text-rust" />
					<time>{event.date}</time>
					{event.time && <span className="text-muted-foreground">({event.time})</span>}
				</div>
				<CardTitle className="text-lg leading-snug text-primary">{event.title}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-3">
				{event.location && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0 text-rust" />
						<span className="truncate">{event.location}</span>
					</div>
				)}
				{event.description && (
					<p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
				)}

				{/* Participant capacity */}
				<div>
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<Users className="h-3 w-3" />
							Participants
						</span>
						<span>
							{participantCount} / {event.participantCapacity}
							{spotsLeft > 0 && <span className="ml-1 text-green-700">({spotsLeft} left)</span>}
							{spotsLeft === 0 && event.participantCapacity > 0 && (
								<span className="ml-1 font-medium text-rust">(Full)</span>
							)}
						</span>
					</div>
					<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className={`h-full rounded-full transition-all ${spotsLeft === 0 && event.participantCapacity > 0 ? "bg-rust" : "bg-primary"}`}
							style={{
								width: `${Math.min(100, event.participantCapacity > 0 ? (participantCount / event.participantCapacity) * 100 : 0)}%`,
							}}
						/>
					</div>
				</div>

				{waitlistedCount > 0 && (
					<Badge variant="secondary" className="w-fit border-ochre/20 bg-ochre/10 text-ochre">
						{waitlistedCount} pending
					</Badge>
				)}
			</CardContent>

			<CardFooter className="flex gap-2">
				<Link href={`/admin/events/${event.id}`} className="flex-1">
					<Button
						variant="outline"
						className="w-full rounded-sm font-heading uppercase tracking-wider"
						size="sm"
					>
						Manage
					</Button>
				</Link>
				<Link href={`/admin/events/${event.id}/edit`}>
					<Button variant="ghost" size="sm">
						<Pencil className="h-4 w-4" />
					</Button>
				</Link>
				<form
					action={async () => {
						await togglePublishAction(event.id);
					}}
				>
					<Button variant="ghost" size="sm" type="submit">
						{event.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</Button>
				</form>
				{(() => {
					const isDeactivated =
						!event.isPublished && event.date < new Date().toISOString().split("T")[0];
					return (
						<ReasonDialog
							title={isDeactivated ? "Delete Event" : "Cancel Event"}
							description={
								isDeactivated
									? `"${event.title}" will be permanently deleted. No emails will be sent.`
									: `"${event.title}" will be deleted and all registered participants will be notified by email.`
							}
							confirmLabel={isDeactivated ? "Delete Event" : "Cancel Event"}
							pendingLabel={isDeactivated ? "Deleting..." : "Cancelling..."}
							placeholder="e.g. Weather conditions, venue unavailable, insufficient signups..."
							trigger={
								<Button variant="ghost" size="sm">
									<Trash2 className="h-4 w-4" />
								</Button>
							}
							onConfirm={async (reason) => {
								await deleteEventAction(event.id, reason);
							}}
						/>
					);
				})()}
			</CardFooter>
		</Card>
	);
}
