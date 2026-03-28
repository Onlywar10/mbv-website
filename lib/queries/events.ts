import { and, asc, count, desc, eq, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { eventTemplates } from "@/lib/db/schema/event-templates";
import { events } from "@/lib/db/schema/events";

export async function getEvents() {
	// Auto-deactivate past events
	const today = new Date().toISOString().split("T")[0];
	await db
		.update(events)
		.set({ isPublished: false })
		.where(and(lt(events.date, today), eq(events.isPublished, true)));

	// Return events sorted: upcoming first (ascending), then past (descending)
	return db
		.select()
		.from(events)
		.orderBy(
			sql`CASE WHEN ${events.date} >= ${today} THEN 0 ELSE 1 END`,
			asc(events.date),
		);
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
			registeredBy: eventRegistrations.registeredBy,
			registeredAt: eventRegistrations.registeredAt,
			notes: eventRegistrations.notes,
			waiverSignedAt: clients.waiverSignedAt,
			waiverExpiresAt: clients.waiverExpiresAt,
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

export async function getRegistrationCountsByEvent() {
	const result = await db
		.select({
			eventId: eventRegistrations.eventId,
			role: eventRegistrations.role,
			value: count(),
		})
		.from(eventRegistrations)
		.where(eq(eventRegistrations.status, "registered"))
		.groupBy(eventRegistrations.eventId, eventRegistrations.role);

	const counts: Record<string, { participants: number; volunteers: number }> = {};
	for (const r of result) {
		if (!counts[r.eventId]) {
			counts[r.eventId] = { participants: 0, volunteers: 0 };
		}
		if (r.role === "participant") {
			counts[r.eventId].participants = r.value;
		} else if (r.role === "volunteer") {
			counts[r.eventId].volunteers = r.value;
		}
	}
	return counts;
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
