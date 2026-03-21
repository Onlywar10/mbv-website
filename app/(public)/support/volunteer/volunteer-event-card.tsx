"use client";

import {
	CalendarDays,
	CheckCircle,
	ChevronDown,
	Clock,
	HandHelping,
	Info,
	MapPin,
	Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { volunteerForEventAction } from "@/lib/actions/public";

const categoryColors: Record<string, string> = {
	fishing: "bg-rust text-cream",
	"whale-watching": "bg-ink text-cream",
	volunteer: "bg-ochre text-ink",
	community: "bg-secondary text-cream",
	derby: "bg-ink text-cream",
};

const categoryLabels: Record<string, string> = {
	fishing: "Fishing",
	"whale-watching": "Whale Watching",
	volunteer: "Volunteer",
	community: "Community",
	derby: "Derby",
};

type Event = {
	id: string;
	title: string;
	date: string;
	time: string | null;
	location: string | null;
	category: string;
	description: string | null;
	imageUrl: string | null;
	volunteerCapacity: number;
	volunteerDescription: string | null;
	volunteerTime: string | null;
	volunteerNotes: string | null;
};

interface VolunteerEventCardProps {
	event: Event;
	clientId: string;
}

export function VolunteerEventCard({ event, clientId }: VolunteerEventCardProps) {
	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
	const [message, setMessage] = useState("");
	const [expanded, setExpanded] = useState(false);

	const hasDetails = event.volunteerDescription || event.volunteerTime || event.volunteerNotes;

	async function handleVolunteer() {
		setStatus("pending");
		const result = await volunteerForEventAction(clientId, event.id);
		if (result.error) {
			setStatus("error");
			setMessage(result.error);
		} else {
			setStatus("success");
			setMessage(result.success ?? "Signed up!");
		}
	}

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
				<div className="absolute top-3 left-3">
					<span
						className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold ${categoryColors[event.category] ?? ""}`}
					>
						{categoryLabels[event.category] ?? event.category}
					</span>
				</div>
			</div>

			<CardHeader className="pb-0">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CalendarDays className="h-4 w-4 shrink-0 text-rust" />
					<time>{event.date}</time>
				</div>
				<CardTitle className="text-lg leading-snug text-primary">{event.title}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-3">
				{event.time && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Clock className="h-4 w-4 shrink-0 text-rust" />
						<span>Event: {event.time}</span>
					</div>
				)}
				{event.location && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0 text-rust" />
						<span className="truncate">{event.location}</span>
					</div>
				)}
				{event.description && (
					<p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
				)}
				<div className="mt-auto flex items-center gap-2">
					<Badge variant="secondary" className="border-ochre/20 bg-ochre/10 text-ochre">
						<Users className="mr-1 h-3 w-3" />
						{event.volunteerCapacity} volunteers needed
					</Badge>
				</div>

				{/* Expandable Volunteer Details */}
				{hasDetails && (
					<div>
						<button
							type="button"
							onClick={() => setExpanded(!expanded)}
							className="flex w-full items-center justify-between rounded-sm bg-ochre/5 px-3 py-2 text-xs font-medium text-ochre transition-colors hover:bg-ochre/10"
						>
							<span>Volunteer Details</span>
							<ChevronDown
								className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
							/>
						</button>

						{expanded && (
							<div className="mt-2 space-y-3 rounded-sm border border-ochre/20 bg-ochre/5 p-3">
								{event.volunteerTime && (
									<div className="flex items-start gap-2">
										<Clock className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
										<div>
											<p className="text-xs font-medium text-primary">Arrival Time</p>
											<p className="text-xs text-muted-foreground">{event.volunteerTime}</p>
										</div>
									</div>
								)}
								{event.volunteerDescription && (
									<div className="flex items-start gap-2">
										<HandHelping className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
										<div>
											<p className="text-xs font-medium text-primary">What You'll Do</p>
											<p className="text-xs text-muted-foreground">{event.volunteerDescription}</p>
										</div>
									</div>
								)}
								{event.volunteerNotes && (
									<div className="flex items-start gap-2">
										<Info className="mt-0.5 h-4 w-4 shrink-0 text-ochre" />
										<div>
											<p className="text-xs font-medium text-primary">Notes</p>
											<p className="text-xs text-muted-foreground">{event.volunteerNotes}</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</CardContent>

			<CardFooter>
				{status === "success" ? (
					<div className="flex w-full items-center justify-center gap-2 rounded-sm bg-sage/10 px-4 py-2.5 text-sm font-medium text-sage">
						<CheckCircle className="h-4 w-4" />
						{message}
					</div>
				) : (
					<div className="w-full space-y-2">
						{status === "error" && <p className="text-center text-xs text-rust">{message}</p>}
						<Button
							onClick={handleVolunteer}
							disabled={status === "pending"}
							className="w-full rounded-sm bg-ochre font-heading uppercase tracking-wider text-ink hover:bg-ochre-light"
							size="lg"
						>
							{status === "pending" ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
									Signing up...
								</>
							) : (
								<>
									<HandHelping className="mr-2 h-4 w-4" />
									Volunteer
								</>
							)}
						</Button>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
