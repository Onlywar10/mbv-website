import { and, eq, isNotNull, lt } from "drizzle-orm";
import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { logger } from "@/lib/logger";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { memberships } from "@/lib/db/schema/memberships";
import {
	sendDailyRegistrationReport,
	sendEventDayOfReminderEmail,
	sendEventReminderEmail,
	sendMembershipExpiredEmail,
	sendPostEventThanksEmail,
} from "@/lib/email";
import {
	getRecentlyExpiredMemberships,
	getUpcomingEventsWithRegistrants,
	getWaitlistedRegistrations,
	getYesterdayEventsWithVolunteers,
} from "@/lib/queries/email";
import { getNotificationEmails, getSetting } from "@/lib/queries/settings";

function getBaseUrl(): string {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return "http://localhost:3000";
}

export async function GET(request: Request) {
	if (!verifyCronRequest(request)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const results = {
		dailyReport: 0,
		eventDayOfReminders: 0,
		eventReminders: 0,
		membershipExpiry: 0,
		postEventThanks: 0,
		waiverExpiry: 0,
	};

	// --- 1. Daily Registration Report ---
	try {
		const [registrations, adminEmails] = await Promise.all([
			getWaitlistedRegistrations(),
			getNotificationEmails("notify_events"),
		]);

		if (adminEmails.length > 0 && registrations.length > 0) {
			const eventMap = new Map<
				string,
				{
					eventId: string;
					eventTitle: string;
					eventDate: string;
					registrations: { clientFirstName: string; clientLastName: string; role: string }[];
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

			await sendDailyRegistrationReport({
				events: Array.from(eventMap.values()),
				adminEmails,
				baseUrl: getBaseUrl(),
			});
			results.dailyReport = adminEmails.length;
		}
	} catch (err) {
		logger.error("cron", "Daily report failed", { error: String(err) });
	}

	// --- 2. Event Reminders (2 days out) — include waiver link if needed ---
	try {
		const registrants = await getUpcomingEventsWithRegistrants(2);
		const waiverUrl = await getSetting("smartwaiver_waiver_url");

		for (const r of registrants) {
			if (!r.clientEmail) continue;

			// Check if this registrant needs a waiver
			const needsWaiver = waiverUrl && (!r.waiverExpiresAt || new Date(r.waiverExpiresAt) <= new Date());

			sendEventReminderEmail({
				to: r.clientEmail,
				firstName: r.clientFirstName,
				role: r.role,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
				waiverUrl: needsWaiver ? waiverUrl : undefined,
			}).catch((err) => logger.error("cron", "Failed to send event reminder", { to: r.clientEmail, error: String(err) }));

			results.eventReminders++;
		}
	} catch (err) {
		logger.error("cron", "Event reminders failed", { error: String(err) });
	}

	// --- 3. Day-Of Event Reminder (morning of) ---
	try {
		const todayRegistrants = await getUpcomingEventsWithRegistrants(0);
		const dayOfWaiverUrl = await getSetting("smartwaiver_waiver_url");

		for (const r of todayRegistrants) {
			if (!r.clientEmail) continue;

			const needsWaiver = dayOfWaiverUrl && (!r.waiverExpiresAt || new Date(r.waiverExpiresAt) <= new Date());

			sendEventDayOfReminderEmail({
				to: r.clientEmail,
				firstName: r.clientFirstName,
				role: r.role,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
				waiverUrl: needsWaiver ? dayOfWaiverUrl : undefined,
			}).catch((err) => logger.error("cron", "Failed to send day-of reminder", { to: r.clientEmail, error: String(err) }));

			results.eventDayOfReminders++;
		}
	} catch (err) {
		logger.error("cron", "Day-of event reminders failed", { error: String(err) });
	}

	// --- 4. Membership Expiry (7 days after) ---
	try {
		const expired = await getRecentlyExpiredMemberships();

		for (const m of expired) {
			if (!m.email || !m.expiresAt) continue;

			await db
				.update(memberships)
				.set({ status: "expired" })
				.where(eq(memberships.id, m.id));

			sendMembershipExpiredEmail({
				to: m.email,
				firstName: m.firstName,
				type: m.type as "annual" | "lifetime",
				expiresAt: m.expiresAt,
			}).catch((err) => logger.error("cron", "Failed to send membership expiry email", { to: m.email, error: String(err) }));

			results.membershipExpiry++;
		}
	} catch (err) {
		logger.error("cron", "Membership expiry failed", { error: String(err) });
	}

	// --- 5. Post-Event Volunteer Thank You (yesterday's events) ---
	try {
		const volunteers = await getYesterdayEventsWithVolunteers();

		for (const v of volunteers) {
			if (!v.clientEmail) continue;

			sendPostEventThanksEmail({
				to: v.clientEmail,
				firstName: v.clientFirstName,
				eventTitle: v.eventTitle,
				eventDate: v.eventDate,
			}).catch((err) => logger.error("cron", "Failed to send post-event thanks", { to: v.clientEmail, error: String(err) }));

			results.postEventThanks++;
		}
	} catch (err) {
		logger.error("cron", "Post-event thanks failed", { error: String(err) });
	}

	// --- 6. Waiver Expiry — clear expired waivers so clients must re-sign ---
	try {
		const now = new Date();

		await db
			.update(clients)
			.set({ waiverSignedAt: null, waiverExpiresAt: null })
			.where(
				and(
					isNotNull(clients.waiverSignedAt),
					lt(clients.waiverExpiresAt, now),
				),
			);

		// Drizzle doesn't return count from update, so we log the action
		logger.info("cron", "Waiver expiry check completed");
	} catch (err) {
		logger.error("cron", "Waiver expiry failed", { error: String(err) });
	}

	return Response.json({ ok: true, ...results });
}
