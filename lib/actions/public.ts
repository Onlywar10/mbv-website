"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import { findClientByEmail } from "@/lib/queries/clients";
import type { ActionState } from "@/lib/types";
import { eventSignupSchema, volunteerSignupSchema } from "@/lib/validations/public";

async function findOrCreateClient(data: {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}): Promise<string> {
	const existing = await findClientByEmail(data.email);
	if (existing) return existing.id;

	const result = await db
		.insert(clients)
		.values({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email.toLowerCase(),
			phone: data.phone,
			isActive: true,
			emailOptIn: true,
		})
		.returning({ id: clients.id });

	return result[0].id;
}

export async function publicEventSignupAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const parsed = eventSignupSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	// Validate guest fields if bringing a guest
	if (data.hasGuest) {
		if (!data.guestFirstName || !data.guestLastName || !data.guestEmail || !data.guestPhone) {
			return { error: "All guest fields are required when bringing a guest" };
		}
	}

	// Check capacity
	const event = await db
		.select({ participantCapacity: events.participantCapacity })
		.from(events)
		.where(eq(events.id, data.eventId))
		.limit(1);

	if (!event[0]) {
		return { error: "Event not found" };
	}

	const regCountResult = await db
		.select({ value: count() })
		.from(eventRegistrations)
		.where(
			and(
				eq(eventRegistrations.eventId, data.eventId),
				eq(eventRegistrations.role, "participant"),
				eq(eventRegistrations.status, "registered"),
			),
		);

	const currentCount = regCountResult[0]?.value ?? 0;
	const spotsNeeded = data.hasGuest ? 2 : 1;

	if (currentCount + spotsNeeded > event[0].participantCapacity) {
		return { error: "Not enough spots available for this event" };
	}

	const clientId = await findOrCreateClient({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone,
	});

	// Check if already registered as participant
	const existing = await db
		.select({ id: eventRegistrations.id })
		.from(eventRegistrations)
		.where(
			and(
				eq(eventRegistrations.eventId, data.eventId),
				eq(eventRegistrations.clientId, clientId),
				eq(eventRegistrations.role, "participant"),
			),
		)
		.limit(1);

	if (existing.length > 0) {
		return { error: "You are already registered for this event" };
	}

	// Create parent registration
	const parentResult = await db
		.insert(eventRegistrations)
		.values({
			eventId: data.eventId,
			clientId,
			role: "participant",
			status: "waitlisted",
		})
		.returning({ id: eventRegistrations.id });

	const parentId = parentResult[0].id;

	// Add participant role if not already assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "participant")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "participant" });
	}

	// Create guest registration if bringing a guest
	if (data.hasGuest && data.guestFirstName && data.guestEmail) {
		const guestClientId = await findOrCreateClient({
			firstName: data.guestFirstName,
			lastName: data.guestLastName,
			email: data.guestEmail,
			phone: data.guestPhone,
		});

		await db.insert(eventRegistrations).values({
			eventId: data.eventId,
			clientId: guestClientId,
			role: "participant",
			status: "waitlisted",
			registeredBy: parentId,
		});

		// Add participant role to guest
		const guestHasRole = await db
			.select({ id: clientRoles.id })
			.from(clientRoles)
			.where(and(eq(clientRoles.clientId, guestClientId), eq(clientRoles.role, "participant")))
			.limit(1);

		if (guestHasRole.length === 0) {
			await db.insert(clientRoles).values({ clientId: guestClientId, role: "participant" });
		}
	}

	revalidatePath("/events");
	revalidatePath("/admin/events");

	return { success: "Your registration has been submitted and is pending review" };
}

export async function publicVolunteerSignupAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	const parsed = volunteerSignupSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	const clientId = await findOrCreateClient({
		firstName: data.firstName,
		lastName: data.lastName,
		email: data.email,
		phone: data.phone,
	});

	// Add volunteer role if not already assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "volunteer")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "volunteer" });
	}

	revalidatePath("/admin/clients");

	redirect(`/support/volunteer?clientId=${clientId}`);
}

export async function volunteerForEventAction(
	clientId: string,
	eventId: string,
): Promise<ActionState> {
	// Check if already registered as volunteer
	const existing = await db
		.select({ id: eventRegistrations.id })
		.from(eventRegistrations)
		.where(
			and(
				eq(eventRegistrations.eventId, eventId),
				eq(eventRegistrations.clientId, clientId),
				eq(eventRegistrations.role, "volunteer"),
			),
		)
		.limit(1);

	if (existing.length > 0) {
		return { error: "You are already signed up to volunteer for this event" };
	}

	await db.insert(eventRegistrations).values({
		eventId,
		clientId,
		role: "volunteer",
		status: "waitlisted",
	});

	revalidatePath("/support/volunteer");
	revalidatePath("/admin/events");

	return { success: "Your volunteer signup has been submitted and is pending review" };
}
