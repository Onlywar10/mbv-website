import { and, eq, gte, lte, notInArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import { memberships } from "@/lib/db/schema/memberships";
import { users } from "@/lib/db/schema/users";

export async function getWaitlistedRegistrations() {
	return db
		.select({
			eventId: events.id,
			eventTitle: events.title,
			eventDate: events.date,
			clientFirstName: clients.firstName,
			clientLastName: clients.lastName,
			role: eventRegistrations.role,
		})
		.from(eventRegistrations)
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.status, "waitlisted"))
		.orderBy(events.title, eventRegistrations.registeredAt);
}

export async function getActiveAdminEmails() {
	return db
		.select({ email: users.email, name: users.name })
		.from(users)
		.where(and(eq(users.role, "admin"), eq(users.isActive, true)));
}

/** Get registered attendees for events happening in exactly N days. */
export async function getUpcomingEventsWithRegistrants(daysAhead: number) {
	const target = new Date();
	target.setDate(target.getDate() + daysAhead);
	const dateStr = target.toISOString().split("T")[0];

	return db
		.select({
			eventId: events.id,
			eventTitle: events.title,
			eventDate: events.date,
			eventTime: events.time,
			eventLocation: events.location,
			requiredWaivers: events.requiredWaivers,
			clientId: clients.id,
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
		})
		.from(eventRegistrations)
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(and(eq(events.date, dateStr), eq(eventRegistrations.status, "registered")));
}

/** Get annual memberships that expired between 7 and 8 days ago (still status=active). */
export async function getRecentlyExpiredMemberships() {
	const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
	const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	return db
		.select({
			id: memberships.id,
			email: memberships.email,
			firstName: memberships.firstName,
			type: memberships.type,
			expiresAt: memberships.expiresAt,
		})
		.from(memberships)
		.where(
			and(
				eq(memberships.status, "active"),
				eq(memberships.type, "annual"),
				gte(memberships.expiresAt, eightDaysAgo),
				lte(memberships.expiresAt, sevenDaysAgo),
			),
		);
}

/** Get registrants for volunteer-category events that happened yesterday. */
export async function getYesterdayVolunteerEventRegistrants() {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const dateStr = yesterday.toISOString().split("T")[0];

	return db
		.select({
			eventTitle: events.title,
			eventDate: events.date,
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
		})
		.from(eventRegistrations)
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(
			and(
				eq(events.date, dateStr),
				eq(events.category, "volunteer"),
				eq(eventRegistrations.status, "registered"),
			),
		);
}

/** Get active clients who opted in to emails (for mailing list). */
export async function getMailingListClients() {
	return db
		.select({
			id: clients.id,
			email: clients.email,
			firstName: clients.firstName,
			lastName: clients.lastName,
		})
		.from(clients)
		.where(and(eq(clients.isActive, true), eq(clients.emailOptIn, true)))
		.orderBy(clients.lastName);
}

/** Get clients with the volunteer role who are NOT already registered for a specific event. */
export async function getPastVolunteersNotRegistered(eventId: string) {
	// Get IDs of clients already registered for this event (any role)
	const registered = await db
		.select({ clientId: eventRegistrations.clientId })
		.from(eventRegistrations)
		.where(eq(eventRegistrations.eventId, eventId));

	const registeredIds = registered.map((r) => r.clientId);

	return db
		.selectDistinct({
			id: clients.id,
			email: clients.email,
			firstName: clients.firstName,
			lastName: clients.lastName,
		})
		.from(clientRoles)
		.innerJoin(clients, eq(clientRoles.clientId, clients.id))
		.where(
			and(
				eq(clientRoles.role, "volunteer"),
				eq(clients.isActive, true),
				eq(clients.emailOptIn, true),
				...(registeredIds.length > 0 ? [notInArray(clients.id, registeredIds)] : []),
			),
		);
}
