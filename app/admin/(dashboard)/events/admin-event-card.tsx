"use client";

import { CalendarDays, Eye, EyeOff, MapPin, Pencil, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteDialog } from "@/components/admin/delete-dialog";
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
	volunteerCapacity: number;
	isPublished: boolean;
};

interface AdminEventCardProps {
	event: AdminEvent;
	waitlistedCount: number;
}

export function AdminEventCard({ event, waitlistedCount }: AdminEventCardProps) {
	return (
		<Card className="h-full overflow-hidden rounded-sm bg-cream ring-1 ring-border transition-shadow hover:shadow-sharp">
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

			<CardContent className="flex flex-col gap-3">
				{event.location && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0 text-rust" />
						<span className="truncate">{event.location}</span>
					</div>
				)}
				{event.description && (
					<p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
				)}
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="secondary" className="border-rust/20 bg-rust/10 text-rust">
						<Users className="mr-1 h-3 w-3" />
						{event.participantCapacity} participants
					</Badge>
					{waitlistedCount > 0 && (
						<Badge variant="secondary" className="border-ochre/20 bg-ochre/10 text-ochre">
							{waitlistedCount} pending
						</Badge>
					)}
				</div>
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
				<DeleteDialog
					title={event.title}
					onConfirm={async () => {
						await deleteEventAction(event.id);
					}}
				/>
			</CardFooter>
		</Card>
	);
}
