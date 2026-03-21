"use client";

import { Eye, EyeOff, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { CategoryBadge, PublishBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { deleteEventAction, togglePublishAction } from "@/lib/actions/events";

type Event = {
	id: string;
	title: string;
	slug: string;
	date: string;
	category: string;
	spotsAvailable: number;
	isPublished: boolean;
};

interface EventsTableProps {
	events: Event[];
}

export function EventsTable({ events }: EventsTableProps) {
	const [filter, setFilter] = useState("all");

	const filtered =
		filter === "all"
			? events
			: events.filter((e) => (filter === "published" ? e.isPublished : !e.isPublished));

	return (
		<div>
			<div className="mb-4 flex gap-2">
				{["all", "published", "draft"].map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setFilter(f)}
						className={`rounded-sm px-3 py-1.5 text-sm font-heading uppercase tracking-wide transition-colors ${
							filter === f ? "bg-rust/10 text-rust" : "text-muted-foreground hover:bg-muted"
						}`}
					>
						{f}
					</button>
				))}
			</div>

			<div className="overflow-x-auto rounded-sm ring-1 ring-border">
				<table className="w-full text-sm">
					<thead className="bg-cream text-left">
						<tr>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Title
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Date
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Category
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Spots
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Status
							</th>
							<th className="px-4 py-3 font-heading text-xs uppercase tracking-wider text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border bg-cream/50">
						{filtered.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
									No events found
								</td>
							</tr>
						) : (
							filtered.map((event) => (
								<tr key={event.id} className="hover:bg-cream">
									<td className="px-4 py-3 font-medium text-primary">{event.title}</td>
									<td className="px-4 py-3 text-muted-foreground">{event.date}</td>
									<td className="px-4 py-3">
										<CategoryBadge category={event.category} />
									</td>
									<td className="px-4 py-3 text-muted-foreground">{event.spotsAvailable}</td>
									<td className="px-4 py-3">
										<PublishBadge isPublished={event.isPublished} />
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-1">
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
													{event.isPublished ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</form>
											<DeleteDialog
												title={event.title}
												onConfirm={async () => {
													await deleteEventAction(event.id);
												}}
											/>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
