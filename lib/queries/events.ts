import { and, asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { eventTemplates } from "@/lib/db/schema/event-templates";
import { events } from "@/lib/db/schema/events";

export async function getEvents() {
	return db.select().from(events).orderBy(desc(events.date));
}

export async function getPublishedEvents() {
	return db.select().from(events).where(eq(events.isPublished, true)).orderBy(asc(events.date));
}

export async function getVolunteerEvents() {
	return db
		.select()
		.from(events)
		.where(and(eq(events.isPublished, true), eq(events.volunteerEnabled, true)))
		.orderBy(asc(events.date));
}

export async function getEventById(id: string) {
	const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
	return result[0] ?? null;
}

export async function getEventBySlug(slug: string) {
	const result = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
	return result[0] ?? null;
}

export async function getEventTemplates() {
	return db.select().from(eventTemplates).orderBy(asc(eventTemplates.name));
}

export async function getEventTemplateById(id: string) {
	const result = await db.select().from(eventTemplates).where(eq(eventTemplates.id, id)).limit(1);
	return result[0] ?? null;
}

export async function getEventRegistrations(eventId: string) {
	return db
		.select({
			id: eventRegistrations.id,
			clientId: clients.id,
			firstName: clients.firstName,
			lastName: clients.lastName,
			email: clients.email,
			role: eventRegistrations.role,
			status: eventRegistrations.status,
			guestCount: eventRegistrations.guestCount,
			registeredAt: eventRegistrations.registeredAt,
			notes: eventRegistrations.notes,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.eventId, eventId))
		.orderBy(desc(eventRegistrations.registeredAt));
}

export async function getRegistrationCount(eventId: string) {
	const result = await db
		.select({ value: count() })
		.from(eventRegistrations)
		.where(eq(eventRegistrations.eventId, eventId));
	return result[0]?.value ?? 0;
}

export async function getParticipantCountsByEvent() {
	const result = await db
		.select({
			eventId: eventRegistrations.eventId,
			value: count(),
		})
		.from(eventRegistrations)
		.where(
			and(eq(eventRegistrations.role, "participant"), eq(eventRegistrations.status, "registered")),
		)
		.groupBy(eventRegistrations.eventId);

	return Object.fromEntries(result.map((r) => [r.eventId, r.value]));
}

export async function getWaitlistedCountsByEvent() {
	const result = await db
		.select({
			eventId: eventRegistrations.eventId,
			value: count(),
		})
		.from(eventRegistrations)
		.where(eq(eventRegistrations.status, "waitlisted"))
		.groupBy(eventRegistrations.eventId);

	return Object.fromEntries(result.map((r) => [r.eventId, r.value]));
}
