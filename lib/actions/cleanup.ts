"use server";

import { and, eq, lt } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { clientEventHistory } from "@/lib/db/schema/client-event-history";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import type { ActionState } from "@/lib/types";

export async function cleanupOldEvents(): Promise<ActionState> {
	await requireAuth();

	const oneMonthAgo = new Date();
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	const cutoff = oneMonthAgo.toISOString().split("T")[0];

	// Find old events
	const oldEvents = await db.select().from(events).where(lt(events.date, cutoff));

	if (oldEvents.length === 0) {
		return { success: "No events to clean up" };
	}

	let archived = 0;

	for (const event of oldEvents) {
		// Get attended registrations
		const attendees = await db
			.select()
			.from(eventRegistrations)
			.where(
				and(eq(eventRegistrations.eventId, event.id), eq(eventRegistrations.status, "attended")),
			);

		// Archive to client history
		for (const reg of attendees) {
			await db.insert(clientEventHistory).values({
				clientId: reg.clientId,
				eventTitle: event.title,
				eventDate: event.date,
				eventCategory: event.category,
				guestCount: reg.guestCount,
			});

			// Increment total events attended
			await db
				.update(clients)
				.set({
					totalEventsAttended:
						(
							await db
								.select({ val: clients.totalEventsAttended })
								.from(clients)
								.where(eq(clients.id, reg.clientId))
						)[0].val + 1,
				})
				.where(eq(clients.id, reg.clientId));

			archived++;
		}

		// Delete event (registrations cascade)
		await db.delete(events).where(eq(events.id, event.id));
	}

	return {
		success: `Cleaned up ${oldEvents.length} event(s), archived ${archived} attendance record(s)`,
	};
}
