"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { events } from "@/lib/db/schema/events";
import type { ActionState } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { eventSchema } from "@/lib/validations/events";

export async function createEventAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = eventSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;
	let slug = slugify(data.title);

	// Handle slug collisions
	const existing = await db.select({ id: events.id }).from(events).where(eq(events.slug, slug));
	if (existing.length > 0) {
		slug = `${slug}-${Date.now()}`;
	}

	await db.insert(events).values({
		title: data.title,
		slug,
		date: data.date,
		time: data.time || null,
		location: data.location || null,
		category: data.category,
		description: data.description || null,
		longDescription: data.longDescription || null,
		imageUrl: data.imageUrl || null,
		accessibility: data.accessibility || null,
		spotsAvailable: data.spotsAvailable,
		isPublished: data.isPublished,
	});

	revalidatePath("/admin/events");
	revalidatePath("/events");
	revalidatePath("/");

	return { success: "Event created successfully" };
}

export async function updateEventAction(
	id: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = eventSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;
	const current = await db.select().from(events).where(eq(events.id, id)).limit(1);
	if (!current[0]) {
		return { error: "Event not found" };
	}

	// Regenerate slug if title changed
	let slug = current[0].slug;
	if (data.title !== current[0].title) {
		slug = slugify(data.title);
		const collision = await db.select({ id: events.id }).from(events).where(eq(events.slug, slug));
		if (collision.length > 0 && collision[0].id !== id) {
			slug = `${slug}-${Date.now()}`;
		}
	}

	await db
		.update(events)
		.set({
			title: data.title,
			slug,
			date: data.date,
			time: data.time || null,
			location: data.location || null,
			category: data.category,
			description: data.description || null,
			longDescription: data.longDescription || null,
			imageUrl: data.imageUrl || null,
			accessibility: data.accessibility || null,
			spotsAvailable: data.spotsAvailable,
			isPublished: data.isPublished,
			updatedAt: new Date(),
		})
		.where(eq(events.id, id));

	revalidatePath("/admin/events");
	revalidatePath(`/events/${slug}`);
	revalidatePath("/events");
	revalidatePath("/");

	return { success: "Event updated successfully" };
}

export async function deleteEventAction(id: string): Promise<ActionState> {
	await requireAuth();

	await db.delete(events).where(eq(events.id, id));

	revalidatePath("/admin/events");
	revalidatePath("/events");
	revalidatePath("/");

	return { success: "Event deleted" };
}

export async function togglePublishAction(id: string): Promise<ActionState> {
	await requireAuth();

	const current = await db.select().from(events).where(eq(events.id, id)).limit(1);
	if (!current[0]) {
		return { error: "Event not found" };
	}

	await db
		.update(events)
		.set({
			isPublished: !current[0].isPublished,
			updatedAt: new Date(),
		})
		.where(eq(events.id, id));

	revalidatePath("/admin/events");
	revalidatePath("/events");
	revalidatePath("/");

	return { success: current[0].isPublished ? "Event unpublished" : "Event published" };
}
