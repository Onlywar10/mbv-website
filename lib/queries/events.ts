import { and, asc, count, desc, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientWaivers } from "@/lib/db/schema/client-waivers";
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
		.orderBy(sql`CASE WHEN ${events.date} >= ${today} THEN 0 ELSE 1 END`, asc(events.date));
}

export async function getPublishedEvents() {
	return db.select().from(events).where(eq(events.isPublished, true)).orderBy(asc(events.date));
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

export async function getEventRegistrations(eventId: string, requiredWaivers: string[] = []) {
	const rows = await db
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
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.eventId, eventId))
		.orderBy(desc(eventRegistrations.registeredAt));

	// Look up waiver status for all clients in this event
	const clientIds = [...new Set(rows.map((r) => r.clientId))];
	const waiverRows =
		clientIds.length > 0
			? await db
					.select({
						clientId: clientWaivers.clientId,
						waiverType: clientWaivers.waiverType,
						signedAt: clientWaivers.signedAt,
						expiresAt: clientWaivers.expiresAt,
					})
					.from(clientWaivers)
					.where(inArray(clientWaivers.clientId, clientIds))
			: [];

	const waiverMap = new Map<string, { waiverType: string; signedAt: Date; expiresAt: Date }[]>();
	for (const w of waiverRows) {
		if (!waiverMap.has(w.clientId)) waiverMap.set(w.clientId, []);
		waiverMap
			.get(w.clientId)
			?.push({ waiverType: w.waiverType, signedAt: w.signedAt, expiresAt: w.expiresAt });
	}

	return rows.map((r) => {
		const allWaivers = waiverMap.get(r.clientId) ?? [];
		// Only consider waivers that match the event's required types
		const waivers =
			requiredWaivers.length > 0
				? allWaivers.filter((w) => requiredWaivers.includes(w.waiverType))
				: allWaivers;
		const validWaiver = waivers.find((w) => new Date(w.expiresAt) > new Date());
		const expiredWaiver = !validWaiver
			? waivers.find((w) => new Date(w.expiresAt) <= new Date())
			: null;

		return {
			...r,
			waiverSignedAt: validWaiver?.signedAt ?? expiredWaiver?.signedAt ?? null,
			waiverExpiresAt: validWaiver?.expiresAt ?? expiredWaiver?.expiresAt ?? null,
		};
	});
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
