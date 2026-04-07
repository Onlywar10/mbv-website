"use server";

import { eq } from "drizzle-orm";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { events } from "@/lib/db/schema/events";
import {
	sendDailyRegistrationReport,
	sendEventCancellationEmail,
	sendStatusUpdateEmail,
	sendVolunteerRecruitmentEmail,
} from "@/lib/email";
import { logger } from "@/lib/logger";
import {
	getActiveAdminEmails,
	getPastVolunteersNotRegistered,
	getWaitlistedRegistrations,
} from "@/lib/queries/email";
import type { ActionState } from "@/lib/types";

function getBaseUrl(): string {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}
	return "http://localhost:3000";
}

export async function sendRegistrationReportAction(_prevState: ActionState): Promise<ActionState> {
	await requireAuth();

	const [registrations, admins] = await Promise.all([
		getWaitlistedRegistrations(),
		getActiveAdminEmails(),
	]);

	if (admins.length === 0) {
		return { error: "No active admin users found to send report to." };
	}

	if (registrations.length === 0) {
		return { success: "No pending registrations — no report sent." };
	}

	// Group registrations by event
	const eventMap = new Map<
		string,
		{
			eventId: string;
			eventTitle: string;
			eventDate: string;
			registrations: {
				clientFirstName: string;
				clientLastName: string;
				role: string;
			}[];
		}
	>();

	for (const row of registrations) {
		if (!eventMap.has(row.eventId)) {
			eventMap.set(row.eventId, {
				eventId: row.eventId,
				eventTitle: row.eventTitle,
				eventDate: row.eventDate,
				registrations: [],
			});
		}
		eventMap.get(row.eventId)?.registrations.push({
			clientFirstName: row.clientFirstName,
			clientLastName: row.clientLastName,
			role: row.role,
		});
	}

	const groupedEvents = Array.from(eventMap.values());
	const adminEmails = admins.map((a) => a.email);

	try {
		await sendDailyRegistrationReport({
			events: groupedEvents,
			adminEmails,
			baseUrl: getBaseUrl(),
		});
	} catch (err) {
		logger.error("email", "Failed to send registration report", { error: String(err) });
		return { error: "Failed to send report email. Please try again." };
	}

	logger.info("email", "Registration report sent", {
		adminCount: adminEmails.length,
		registrationCount: registrations.length,
		eventCount: groupedEvents.length,
	});

	return {
		success: `Report sent to ${adminEmails.length} admin${adminEmails.length !== 1 ? "s" : ""} with ${registrations.length} registration${registrations.length !== 1 ? "s" : ""} across ${groupedEvents.length} event${groupedEvents.length !== 1 ? "s" : ""}.`,
	};
}

export async function notifyRegistrationStatusChange(
	registrationId: string,
	status: "registered" | "cancelled",
	reason?: string,
) {
	// Fetch primary registrant + event details + waiver status
	const result = await db
		.select({
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
			waiverExpiresAt: clients.waiverExpiresAt,
			role: eventRegistrations.role,
			eventTitle: events.title,
			eventDate: events.date,
			eventTime: events.time,
			eventLocation: events.location,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.innerJoin(events, eq(eventRegistrations.eventId, events.id))
		.where(eq(eventRegistrations.id, registrationId))
		.limit(1);

	if (!result[0]?.clientEmail) return;

	const r = result[0];

	// Include waiver link in approval emails if client hasn't signed a valid waiver
	let waiverUrl: string | undefined;
	if (status === "registered") {
		const needsWaiver = !r.waiverExpiresAt || new Date(r.waiverExpiresAt) <= new Date();
		if (needsWaiver) {
			const { getSetting } = await import("@/lib/queries/settings");
			waiverUrl = (await getSetting("smartwaiver_waiver_url")) ?? undefined;
		}
	}

	sendStatusUpdateEmail({
		to: r.clientEmail,
		firstName: r.clientFirstName,
		role: r.role,
		status,
		eventTitle: r.eventTitle,
		eventDate: r.eventDate,
		eventTime: r.eventTime,
		eventLocation: r.eventLocation,
		reason,
		waiverUrl,
	}).catch((err) =>
		logger.error("email", "Failed to send status update email", {
			to: r.clientEmail,
			registrationId,
			error: String(err),
		}),
	);

	// Notify guests registered by this person
	const guests = await db
		.select({
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
			waiverExpiresAt: clients.waiverExpiresAt,
			role: eventRegistrations.role,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.registeredBy, registrationId));

	for (const guest of guests) {
		if (guest.clientEmail) {
			let guestWaiverUrl: string | undefined;
			if (status === "registered") {
				const needsWaiver = !guest.waiverExpiresAt || new Date(guest.waiverExpiresAt) <= new Date();
				if (needsWaiver) {
					guestWaiverUrl = waiverUrl; // reuse already-fetched URL
				}
			}

			sendStatusUpdateEmail({
				to: guest.clientEmail,
				firstName: guest.clientFirstName,
				role: guest.role,
				status,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
				reason,
				waiverUrl: guestWaiverUrl,
			}).catch((err) =>
				logger.error("email", "Failed to send guest status update email", {
					to: guest.clientEmail,
					error: String(err),
				}),
			);
		}
	}
}

export async function notifyEventCancellation(eventId: string, reason?: string) {
	// Fetch event details
	const eventResult = await db
		.select({ title: events.title, date: events.date })
		.from(events)
		.where(eq(events.id, eventId))
		.limit(1);

	if (!eventResult[0]) return;

	const event = eventResult[0];

	// Fetch all registered clients for this event
	const registrants = await db
		.select({
			email: clients.email,
			firstName: clients.firstName,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.eventId, eventId));

	for (const registrant of registrants) {
		if (registrant.email) {
			sendEventCancellationEmail({
				to: registrant.email,
				firstName: registrant.firstName,
				eventTitle: event.title,
				eventDate: event.date,
				reason,
			}).catch((err) =>
				logger.error("email", "Failed to send cancellation email", {
					to: registrant.email,
					eventId,
					error: String(err),
				}),
			);
		}
	}
}

export async function sendVolunteerRecruitmentAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const eventId = formData.get("eventId") as string;
	const clientIdsStr = (formData.get("clientIds") as string)?.trim() || "";
	const personalMessage = (formData.get("personalMessage") as string)?.trim() || undefined;

	if (!eventId) {
		return { error: "Event ID is required." };
	}

	const selectedIds = clientIdsStr.split(",").filter(Boolean);
	if (selectedIds.length === 0) {
		return { error: "No volunteers selected." };
	}

	// Fetch event details
	const eventResult = await db
		.select({
			title: events.title,
			date: events.date,
			time: events.time,
			location: events.location,
		})
		.from(events)
		.where(eq(events.id, eventId))
		.limit(1);

	if (!eventResult[0]) {
		return { error: "Event not found." };
	}

	const event = eventResult[0];

	// Get past volunteers not registered for this event, then filter to selected
	const allVolunteers = await getPastVolunteersNotRegistered(eventId);
	const selectedSet = new Set(selectedIds);
	const volunteers = allVolunteers.filter((v) => selectedSet.has(v.id));

	if (volunteers.length === 0) {
		return { error: "No eligible volunteers found to contact." };
	}

	let sent = 0;
	for (const v of volunteers) {
		if (!v.email) continue;

		try {
			await sendVolunteerRecruitmentEmail({
				to: v.email,
				firstName: v.firstName,
				eventTitle: event.title,
				eventDate: event.date,
				eventTime: event.time,
				eventLocation: event.location,
				personalMessage,
				volunteerUrl: `${getBaseUrl()}/support#volunteer-form`,
			});
			sent++;
		} catch (err) {
			logger.error("email", "Failed to send recruitment email", {
				to: v.email,
				error: String(err),
			});
		}
	}

	logger.info("email", "Volunteer recruitment emails sent", {
		eventId,
		sent,
		total: volunteers.length,
	});

	return {
		success: `Recruitment email sent to ${sent} volunteer${sent !== 1 ? "s" : ""}.`,
	};
}
