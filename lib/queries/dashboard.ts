import { and, asc, count, eq, gte, sql, sum } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import { memberships } from "@/lib/db/schema/memberships";

export async function getDashboardStats() {
	const today = new Date().toISOString().split("T")[0];

	const [
		[eventCount],
		[publishedCount],
		[clientCount],
		[registrationCount],
		[upcomingCount],
		[donationTotal],
		[activeMemberCount],
		[pendingApplicationCount],
		[waitlistedCount],
	] = await Promise.all([
		db.select({ value: count() }).from(events),
		db.select({ value: count() }).from(events).where(eq(events.isPublished, true)),
		db.select({ value: count() }).from(clients),
		db.select({ value: count() }).from(eventRegistrations),
		db.select({ value: count() }).from(events).where(gte(events.date, today)),
		db.select({ value: sum(donations.amount) }).from(donations),
		db
			.select({ value: count() })
			.from(memberships)
			.where(eq(memberships.status, "active")),
		db
			.select({ value: count() })
			.from(eventRegistrations)
			.where(eq(eventRegistrations.status, "waitlisted")),
		db
			.select({ value: count() })
			.from(eventRegistrations)
			.where(eq(eventRegistrations.status, "waitlisted")),
	]);

	return {
		totalEvents: eventCount?.value ?? 0,
		publishedEvents: publishedCount?.value ?? 0,
		upcomingEvents: upcomingCount?.value ?? 0,
		totalClients: clientCount?.value ?? 0,
		totalRegistrations: registrationCount?.value ?? 0,
		totalDonations: donationTotal?.value ?? "0",
		activeMembers: activeMemberCount?.value ?? 0,
		pendingApplications: pendingApplicationCount?.value ?? 0,
		waitlisted: waitlistedCount?.value ?? 0,
	};
}

export async function getUpcomingEventsWithCapacity(limit = 3) {
	const today = new Date().toISOString().split("T")[0];

	const upcomingEvents = await db
		.select()
		.from(events)
		.where(and(gte(events.date, today), eq(events.isPublished, true)))
		.orderBy(asc(events.date))
		.limit(limit);

	const eventsWithCounts = await Promise.all(
		upcomingEvents.map(async (event) => {
			const [participantResult] = await db
				.select({ value: count() })
				.from(eventRegistrations)
				.where(
					and(
						eq(eventRegistrations.eventId, event.id),
						eq(eventRegistrations.role, "participant"),
						eq(eventRegistrations.status, "registered"),
					),
				);

			const [volunteerResult] = await db
				.select({ value: count() })
				.from(eventRegistrations)
				.where(
					and(
						eq(eventRegistrations.eventId, event.id),
						eq(eventRegistrations.role, "volunteer"),
						eq(eventRegistrations.status, "registered"),
					),
				);

			const participantCount = participantResult?.value ?? 0;
			const volunteerCount = volunteerResult?.value ?? 0;

			return {
				id: event.id,
				title: event.title,
				date: event.date,
				time: event.time,
				location: event.location,
				category: event.category,
				participantCapacity: event.participantCapacity,
				participantCount,
				volunteerCapacity: event.volunteerCapacity,
				volunteerCount,
				volunteerEnabled: event.volunteerEnabled,
				volunteersNeeded: event.volunteerEnabled
					? Math.max(0, event.volunteerCapacity - volunteerCount)
					: 0,
				spotsLeft: Math.max(0, event.participantCapacity - participantCount),
			};
		}),
	);

	return eventsWithCounts;
}

export async function getRecentRegistrations(limit = 5) {
	return db
		.select({
			id: eventRegistrations.id,
			firstName: clients.firstName,
			lastName: clients.lastName,
			role: eventRegistrations.role,
			status: eventRegistrations.status,
			registeredAt: eventRegistrations.registeredAt,
			eventTitle: events.title,
			eventId: events.id,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.orderBy(sql`${eventRegistrations.registeredAt} desc`)
		.limit(limit);
}
