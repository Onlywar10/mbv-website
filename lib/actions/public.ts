"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
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

	await db.insert(eventRegistrations).values({
		eventId: data.eventId,
		clientId,
		role: "participant",
		status: "waitlisted",
		guestCount: data.guestCount,
	});

	// Add participant role if not already assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "participant")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "participant" });
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
		guestCount: 0,
	});

	revalidatePath("/support/volunteer");
	revalidatePath("/admin/events");

	return { success: "Your volunteer signup has been submitted and is pending review" };
}
