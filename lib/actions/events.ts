"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { notifyEventCancellation, notifyRegistrationStatusChange } from "@/lib/actions/email";
import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { eventTemplates } from "@/lib/db/schema/event-templates";
import { events } from "@/lib/db/schema/events";
import { logger } from "@/lib/logger";
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

	try {
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
	} catch (err) {
		logger.error("events", "Failed to create event", { error: String(err) });
		return { error: "Failed to create event. Please try again." };
	}

	logger.info("events", "Event created", { title: data.title, slug, category: data.category });
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
		try {
			await del(oldImageUrl);
		} catch (err) {
			logger.warn("events", "Failed to delete old image blob", { error: String(err) });
		}
	}

	try {
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
	} catch (err) {
		logger.error("events", "Failed to update event", { id, error: String(err) });
		return { error: "Failed to update event. Please try again." };
	}

	logger.info("events", "Event updated", { id, title: data.title, slug });
	revalidatePath("/admin/events");
	revalidatePath(`/events/${slug}`);
	revalidatePath("/events");
	revalidatePath("/");

	return { success: "Event updated successfully" };
}

export async function deleteEventAction(id: string, reason?: string): Promise<ActionState> {
	await requireAuth();

	const event = await db
		.select({ imageUrl: events.imageUrl, date: events.date, isPublished: events.isPublished })
		.from(events)
		.where(eq(events.id, id))
		.limit(1);

	// Only send cancellation emails for active/upcoming events, not deactivated ones
	const isDeactivated =
		event[0] && !event[0].isPublished && event[0].date < new Date().toISOString().split("T")[0];
	if (!isDeactivated) {
		try {
			await notifyEventCancellation(id, reason);
		} catch (err) {
			logger.error("events", "Failed to notify registrants of event cancellation", {
				id,
				error: String(err),
			});
		}
	}

	if (event[0]?.imageUrl?.includes("blob.vercel-storage.com")) {
		try {
			await del(event[0].imageUrl);
		} catch (err) {
			logger.warn("events", "Failed to delete event image blob", { error: String(err) });
		}
	}

	try {
		await db.delete(events).where(eq(events.id, id));
	} catch (err) {
		logger.error("events", "Failed to delete event", { id, error: String(err) });
		return { error: "Failed to delete event. Please try again." };
	}

	logger.info("events", "Event deleted", { id });
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

	try {
		await db
			.update(events)
			.set({
				isPublished: !current[0].isPublished,
				updatedAt: new Date(),
			})
			.where(eq(events.id, id));
	} catch (err) {
		logger.error("events", "Failed to toggle publish status", { id, error: String(err) });
		return { error: "Failed to update publish status. Please try again." };
	}

	logger.info("events", "Event publish toggled", { id, isPublished: !current[0].isPublished });
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

	try {
		await db
			.update(eventRegistrations)
			.set({ status })
			.where(eq(eventRegistrations.id, registrationId));

		// Also update any guest registered by this person
		await db
			.update(eventRegistrations)
			.set({ status })
			.where(eq(eventRegistrations.registeredBy, registrationId));
	} catch (err) {
		logger.error("registrations", "Failed to update registration status", {
			registrationId,
			error: String(err),
		});
		return { error: "Failed to update registration status. Please try again." };
	}

	logger.info("registrations", "Registration status updated", { registrationId, eventId, status });

	// Send approval email (fire-and-forget — don't block the status update)
	if (status === "registered") {
		notifyRegistrationStatusChange(registrationId, status).catch((err) =>
			logger.error("registrations", "Failed to send approval email", {
				registrationId,
				error: String(err),
			}),
		);
	}

	revalidatePath(`/admin/events/${eventId}`);
	return { success: `Status updated to ${status}` };
}

export async function deleteRegistrationAction(
	registrationId: string,
	eventId: string,
	reason?: string,
): Promise<ActionState> {
	await requireAuth();

	// Send denial email before deleting the record
	try {
		await notifyRegistrationStatusChange(registrationId, "cancelled", reason);
	} catch (err) {
		logger.error("registrations", "Failed to send denial email", {
			registrationId,
			error: String(err),
		});
	}

	try {
		// Delete guest registrations linked to this parent
		await db.delete(eventRegistrations).where(eq(eventRegistrations.registeredBy, registrationId));
		await db.delete(eventRegistrations).where(eq(eventRegistrations.id, registrationId));
	} catch (err) {
		logger.error("registrations", "Failed to delete registration", {
			registrationId,
			error: String(err),
		});
		return { error: "Failed to remove registration. Please try again." };
	}

	logger.info("registrations", "Registration deleted", { registrationId, eventId });
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

	try {
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
	} catch (err) {
		logger.error("templates", "Failed to create template", { error: String(err) });
		return { error: "Failed to create template. Please try again." };
	}

	logger.info("templates", "Template created", { name: data.name });
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
		try {
			await del(template[0].imageUrl);
		} catch (err) {
			logger.warn("templates", "Failed to delete template image blob", { error: String(err) });
		}
	}

	try {
		await db.delete(eventTemplates).where(eq(eventTemplates.id, id));
	} catch (err) {
		logger.error("templates", "Failed to delete template", { error: String(err) });
		return { error: "Failed to delete template. Please try again." };
	}

	logger.info("templates", "Template deleted", { id });
	revalidatePath("/admin/events");
	return { success: "Template deleted" };
}
