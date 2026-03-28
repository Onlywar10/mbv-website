import { eq } from "drizzle-orm";
import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";
import {
	sendDailyRegistrationReport,
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
import { getNotificationEmails } from "@/lib/queries/settings";

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
		eventReminders: 0,
		membershipExpiry: 0,
		postEventThanks: 0,
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
		console.error("Cron: daily report failed:", err);
	}

	// --- 2. Event Reminders (2 days out) ---
	try {
		const registrants = await getUpcomingEventsWithRegistrants(2);

		for (const r of registrants) {
			if (!r.clientEmail) continue;

			sendEventReminderEmail({
				to: r.clientEmail,
				firstName: r.clientFirstName,
				role: r.role,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
			}).catch(console.error);

			results.eventReminders++;
		}
	} catch (err) {
		console.error("Cron: event reminders failed:", err);
	}

	// --- 3. Membership Expiry (7 days after) ---
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
			}).catch(console.error);

			results.membershipExpiry++;
		}
	} catch (err) {
		console.error("Cron: membership expiry failed:", err);
	}

	// --- 4. Post-Event Volunteer Thank You (yesterday's events) ---
	try {
		const volunteers = await getYesterdayEventsWithVolunteers();

		for (const v of volunteers) {
			if (!v.clientEmail) continue;

			sendPostEventThanksEmail({
				to: v.clientEmail,
				firstName: v.clientFirstName,
				eventTitle: v.eventTitle,
				eventDate: v.eventDate,
			}).catch(console.error);

			results.postEventThanks++;
		}
	} catch (err) {
		console.error("Cron: post-event thanks failed:", err);
	}

	return Response.json({ ok: true, ...results });
}
