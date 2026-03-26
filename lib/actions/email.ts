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
	sendMembershipExpirationReminderEmail,
	sendStatusUpdateEmail,
} from "@/lib/email";
import { getActiveAdminEmails, getWaitlistedRegistrations } from "@/lib/queries/email";
import { getExpiringMemberships } from "@/lib/queries/memberships";
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
		console.error("Failed to send registration report:", err);
		return { error: "Failed to send report email. Please try again." };
	}

	return {
		success: `Report sent to ${adminEmails.length} admin${adminEmails.length !== 1 ? "s" : ""} with ${registrations.length} registration${registrations.length !== 1 ? "s" : ""} across ${groupedEvents.length} event${groupedEvents.length !== 1 ? "s" : ""}.`,
	};
}

export async function notifyRegistrationStatusChange(
	registrationId: string,
	status: "registered" | "cancelled",
	reason?: string,
) {
	// Fetch primary registrant + event details
	const result = await db
		.select({
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
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
	}).catch(console.error);

	// Notify guests registered by this person
	const guests = await db
		.select({
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
			role: eventRegistrations.role,
		})
		.from(eventRegistrations)
		.innerJoin(clients, eq(eventRegistrations.clientId, clients.id))
		.where(eq(eventRegistrations.registeredBy, registrationId));

	for (const guest of guests) {
		if (guest.clientEmail) {
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
			}).catch(console.error);
		}
	}
}

export async function sendExpirationRemindersAction(_prevState: ActionState): Promise<ActionState> {
	await requireAuth();

	const expiring = await getExpiringMemberships(30);

	if (expiring.length === 0) {
		return { success: "No memberships expiring in the next 30 days." };
	}

	let sent = 0;
	for (const m of expiring) {
		if (m.clientEmail && m.expiresAt) {
			sendMembershipExpirationReminderEmail({
				to: m.clientEmail,
				firstName: m.clientFirstName,
				expiresAt: m.expiresAt,
			}).catch(console.error);
			sent++;
		}
	}

	return { success: `Sent ${sent} expiration reminder${sent !== 1 ? "s" : ""}.` };
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
			}).catch(console.error);
		}
	}
}
