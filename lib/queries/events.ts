import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { eventTemplates } from "@/lib/db/schema/event-templates";
import { events } from "@/lib/db/schema/events";

export async function getEvents() {
	return db.select().from(events).orderBy(desc(events.date));
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

export async function getEventCount() {
	const result = await db.select({ value: count() }).from(events);
	return result[0]?.value ?? 0;
}

export async function getPublishedEventCount() {
	const result = await db
		.select({ value: count() })
		.from(events)
		.where(eq(events.isPublished, true));
	return result[0]?.value ?? 0;
}

export async function getEventTemplates() {
	return db.select().from(eventTemplates).orderBy(asc(eventTemplates.name));
}

export async function getEventTemplateById(id: string) {
	const result = await db.select().from(eventTemplates).where(eq(eventTemplates.id, id)).limit(1);
	return result[0] ?? null;
}
