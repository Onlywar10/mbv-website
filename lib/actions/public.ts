"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import { sendRegistrationConfirmation } from "@/lib/email";
import { logger } from "@/lib/logger";
import { findClientByEmail } from "@/lib/queries/clients";
import type { ActionState } from "@/lib/types";
import { eventSignupSchema, volunteerSignupSchema } from "@/lib/validations/public";

async function findOrCreateClient(data: {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	emailOptIn?: boolean;
}): Promise<string> {
	const existing = await findClientByEmail(data.email);
	if (existing) {
		// If they opted in, update their preference
		if (data.emailOptIn && !existing.emailOptIn) {
			await db.update(clients).set({ emailOptIn: true }).where(eq(clients.id, existing.id));
		}
		return existing.id;
	}

	const result = await db
		.insert(clients)
		.values({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email.toLowerCase(),
			phone: data.phone,
			isActive: true,
			emailOptIn: data.emailOptIn ?? false,
		})
		.returning({ id: clients.id });

	if (!result[0]?.id) {
		throw new Error("Failed to create client record");
	}

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

	let clientId: string;
	try {
		clientId = await findOrCreateClient({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			emailOptIn: data.emailOptIn,
		});
	} catch (err) {
		logger.error("registration", "Failed to find or create client", {
			email: data.email,
			error: String(err),
		});
		return { error: "Failed to process your registration. Please try again." };
	}

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
	let parentId: string;
	try {
		const parentResult = await db
			.insert(eventRegistrations)
			.values({
				eventId: data.eventId,
				clientId,
				role: "participant",
				status: "waitlisted",
			})
			.returning({ id: eventRegistrations.id });

		if (!parentResult[0]?.id) {
			throw new Error("No registration ID returned");
		}
		parentId = parentResult[0].id;
	} catch (err) {
		logger.error("registration", "Failed to create registration", {
			email: data.email,
			eventId: data.eventId,
			error: String(err),
		});
		return { error: "Failed to submit your registration. Please try again." };
	}

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

		// Check if guest is already registered for this event
		const guestExisting = await db
			.select({ id: eventRegistrations.id })
			.from(eventRegistrations)
			.where(
				and(
					eq(eventRegistrations.eventId, data.eventId),
					eq(eventRegistrations.clientId, guestClientId),
					eq(eventRegistrations.role, "participant"),
				),
			)
			.limit(1);

		if (guestExisting.length > 0) {
			return { error: "Your guest is already registered for this event." };
		}

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

	logger.info("registrations", "Event registration created", {
		email: data.email,
		eventId: data.eventId,
		hasGuest: !!data.hasGuest,
	});

	// Fetch event details for confirmation email
	const eventDetails = await db
		.select({
			title: events.title,
			date: events.date,
			time: events.time,
			location: events.location,
		})
		.from(events)
		.where(eq(events.id, data.eventId))
		.limit(1);

	if (eventDetails[0]) {
		const ev = eventDetails[0];

		// Send confirmation to primary registrant
		sendRegistrationConfirmation({
			to: data.email,
			firstName: data.firstName,
			role: "participant",
			eventTitle: ev.title,
			eventDate: ev.date,
			eventTime: ev.time,
			eventLocation: ev.location,
		}).catch((err) =>
			logger.error("email", "Failed to send registration confirmation", {
				to: data.email,
				error: String(err),
			}),
		);

		// Send confirmation to guest if applicable
		if (data.hasGuest && data.guestEmail && data.guestFirstName) {
			sendRegistrationConfirmation({
				to: data.guestEmail,
				firstName: data.guestFirstName,
				role: "participant",
				eventTitle: ev.title,
				eventDate: ev.date,
				eventTime: ev.time,
				eventLocation: ev.location,
			}).catch((err) =>
				logger.error("email", "Failed to send guest confirmation", {
					to: data.guestEmail,
					error: String(err),
				}),
			);
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

	let clientId: string;
	try {
		clientId = await findOrCreateClient({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			phone: data.phone,
			emailOptIn: data.emailOptIn,
		});
	} catch (err) {
		logger.error("registration", "Failed to find or create volunteer client", {
			email: data.email,
			error: String(err),
		});
		return { error: "Failed to process your signup. Please try again." };
	}

	// Add volunteer role if not already assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "volunteer")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "volunteer" });
	}

	logger.info("registrations", "Volunteer signed up", { email: data.email, clientId });
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

	try {
		await db.insert(eventRegistrations).values({
			eventId,
			clientId,
			role: "volunteer",
			status: "waitlisted",
		});
	} catch (err) {
		logger.error("registration", "Failed to create volunteer registration", {
			clientId,
			eventId,
			error: String(err),
		});
		return { error: "Failed to submit your volunteer signup. Please try again." };
	}

	logger.info("registrations", "Volunteer registered for event", { clientId, eventId });

	// Fetch client and event details for confirmation email
	const [clientResult, eventResult] = await Promise.all([
		db
			.select({ firstName: clients.firstName, email: clients.email })
			.from(clients)
			.where(eq(clients.id, clientId))
			.limit(1),
		db
			.select({
				title: events.title,
				date: events.date,
				time: events.time,
				location: events.location,
			})
			.from(events)
			.where(eq(events.id, eventId))
			.limit(1),
	]);

	if (clientResult[0]?.email && eventResult[0]) {
		sendRegistrationConfirmation({
			to: clientResult[0].email,
			firstName: clientResult[0].firstName,
			role: "volunteer",
			eventTitle: eventResult[0].title,
			eventDate: eventResult[0].date,
			eventTime: eventResult[0].time,
			eventLocation: eventResult[0].location,
		}).catch((err) =>
			logger.error("email", "Failed to send volunteer confirmation", {
				to: clientResult[0].email,
				error: String(err),
			}),
		);
	}

	revalidatePath("/support/volunteer");
	revalidatePath("/admin/events");

	return { success: "Your volunteer signup has been submitted and is pending review" };
}
