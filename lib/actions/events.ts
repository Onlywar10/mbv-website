"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { eventTemplates } from "@/lib/db/schema/event-templates";
import { events } from "@/lib/db/schema/events";
import type { ActionState } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { eventSchema, templateSchema } from "@/lib/validations/events";

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
		participantCapacity: data.participantCapacity,
		volunteerCapacity: data.volunteerCapacity,
		volunteerEnabled: data.volunteerEnabled,
		volunteerDescription: data.volunteerDescription || null,
		volunteerTime: data.volunteerTime || null,
		volunteerNotes: data.volunteerNotes || null,
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

	// Clean up old blob if image changed
	const oldImageUrl = current[0].imageUrl;
	const newImageUrl = data.imageUrl || null;
	if (
		oldImageUrl &&
		oldImageUrl !== newImageUrl &&
		oldImageUrl.includes("blob.vercel-storage.com")
	) {
		await del(oldImageUrl);
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
			participantCapacity: data.participantCapacity,
			volunteerCapacity: data.volunteerCapacity,
			volunteerEnabled: data.volunteerEnabled,
			volunteerDescription: data.volunteerDescription || null,
			volunteerTime: data.volunteerTime || null,
			volunteerNotes: data.volunteerNotes || null,
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

	const event = await db
		.select({ imageUrl: events.imageUrl })
		.from(events)
		.where(eq(events.id, id))
		.limit(1);
	if (event[0]?.imageUrl?.includes("blob.vercel-storage.com")) {
		await del(event[0].imageUrl);
	}

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

// -- Registrations ------------------------------------------

export async function updateRegistrationStatusAction(
	registrationId: string,
	eventId: string,
	status: "registered" | "waitlisted" | "attended" | "cancelled",
): Promise<ActionState> {
	await requireAuth();

	await db
		.update(eventRegistrations)
		.set({ status })
		.where(eq(eventRegistrations.id, registrationId));

	// Also update any guest registered by this person
	await db
		.update(eventRegistrations)
		.set({ status })
		.where(eq(eventRegistrations.registeredBy, registrationId));

	revalidatePath(`/admin/events/${eventId}`);
	return { success: `Status updated to ${status}` };
}

export async function deleteRegistrationAction(
	registrationId: string,
	eventId: string,
): Promise<ActionState> {
	await requireAuth();

	await db.delete(eventRegistrations).where(eq(eventRegistrations.id, registrationId));

	revalidatePath(`/admin/events/${eventId}`);
	return { success: "Registration removed" };
}

// -- Templates ----------------------------------------------

export async function createTemplateAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = templateSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	await db.insert(eventTemplates).values({
		name: data.name,
		title: data.title,
		location: data.location || null,
		category: data.category,
		description: data.description || null,
		longDescription: data.longDescription || null,
		imageUrl: data.imageUrl || null,
		accessibility: data.accessibility || null,
		defaultSpots: data.defaultSpots,
	});

	revalidatePath("/admin/events");
	return { success: "Template created" };
}

export async function deleteTemplateAction(id: string): Promise<ActionState> {
	await requireAuth();

	const template = await db
		.select({ imageUrl: eventTemplates.imageUrl })
		.from(eventTemplates)
		.where(eq(eventTemplates.id, id))
		.limit(1);
	if (template[0]?.imageUrl?.includes("blob.vercel-storage.com")) {
		await del(template[0].imageUrl);
	}

	await db.delete(eventTemplates).where(eq(eventTemplates.id, id));

	revalidatePath("/admin/events");
	return { success: "Template deleted" };
}
