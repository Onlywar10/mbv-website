"use client";

import { useState } from "react";
import { AdminEventCard } from "./admin-event-card";

type Event = {
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

interface EventFilterBarProps {
	events: Event[];
	waitlistedCounts: Record<string, number>;
}

export function EventFilterBar({ events, waitlistedCounts }: EventFilterBarProps) {
	const [filter, setFilter] = useState("all");

	const filtered =
		filter === "all"
			? events
			: events.filter((e) => (filter === "published" ? e.isPublished : !e.isPublished));

	return (
		<div>
			<div className="mb-6 flex gap-2">
				{["all", "published", "draft"].map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`rounded-sm px-3 py-1.5 font-heading text-sm uppercase tracking-wide transition-colors ${
							filter === f ? "bg-rust/10 text-rust" : "text-muted-foreground hover:bg-muted"
						}`}
					>
						{f}
					</button>
				))}
			</div>

			{filtered.length === 0 ? (
				<p className="py-12 text-center text-muted-foreground">No events found</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((event) => (
						<AdminEventCard
							key={event.id}
							event={event}
							waitlistedCount={waitlistedCounts[event.id] ?? 0}
						/>
					))}
				</div>
			)}
		</div>
	);
}
