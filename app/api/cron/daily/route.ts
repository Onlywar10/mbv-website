import { eq, lt } from "drizzle-orm";
import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { db } from "@/lib/db";
import { clientWaivers } from "@/lib/db/schema/client-waivers";
import { memberships } from "@/lib/db/schema/memberships";
import {
	sendDailyRegistrationReport,
	sendEventReminderEmail,
	sendMembershipExpiredEmail,
	sendPostEventThanksEmail,
} from "@/lib/email";
import { logger } from "@/lib/logger";
import {
	getRecentlyExpiredMemberships,
	getUpcomingEventsWithRegistrants,
	getWaitlistedRegistrations,
	getYesterdayVolunteerEventRegistrants,
} from "@/lib/queries/email";
import { getNotificationEmails, getWaiverUrlsForEvent } from "@/lib/queries/settings";
import { getMissingWaivers } from "@/lib/queries/waivers";

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
		event3DayReminders: 0,
		event1DayReminders: 0,
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

	// --- 2. Event Reminders (3 days out) — include missing waiver links ---
	try {
		const registrants = await getUpcomingEventsWithRegistrants(3);

		// Cache waiver URLs per event
		const waiverUrlCache = new Map<string, { label: string; url: string }[]>();

		for (const r of registrants) {
			if (!r.clientEmail || !r.clientId) continue;

			let waiverUrls: { label: string; url: string }[] | undefined;

			if (r.requiredWaivers?.length) {
				const missing = await getMissingWaivers(r.clientId, r.requiredWaivers);
				if (missing.length > 0) {
					const cacheKey = missing.sort().join(",");
					if (!waiverUrlCache.has(cacheKey)) {
						waiverUrlCache.set(cacheKey, await getWaiverUrlsForEvent(missing));
					}
					const urls = waiverUrlCache.get(cacheKey);
					if (urls?.length) waiverUrls = urls;
				}
			}

			sendEventReminderEmail({
				to: r.clientEmail,
				firstName: r.clientFirstName,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
				waiverUrls,
			}).catch((err) =>
				logger.error("cron", "Failed to send 3-day event reminder", {
					to: r.clientEmail,
					error: String(err),
				}),
			);

			results.event3DayReminders++;
		}
	} catch (err) {
		logger.error("cron", "3-day event reminders failed", { error: String(err) });
	}

	// --- 3. Event Reminders (1 day out) ---
	try {
		const registrants = await getUpcomingEventsWithRegistrants(1);

		const waiverUrlCache = new Map<string, { label: string; url: string }[]>();

		for (const r of registrants) {
			if (!r.clientEmail || !r.clientId) continue;

			let waiverUrls: { label: string; url: string }[] | undefined;

			if (r.requiredWaivers?.length) {
				const missing = await getMissingWaivers(r.clientId, r.requiredWaivers);
				if (missing.length > 0) {
					const cacheKey = missing.sort().join(",");
					if (!waiverUrlCache.has(cacheKey)) {
						waiverUrlCache.set(cacheKey, await getWaiverUrlsForEvent(missing));
					}
					const urls = waiverUrlCache.get(cacheKey);
					if (urls?.length) waiverUrls = urls;
				}
			}

			sendEventReminderEmail({
				to: r.clientEmail,
				firstName: r.clientFirstName,
				eventTitle: r.eventTitle,
				eventDate: r.eventDate,
				eventTime: r.eventTime,
				eventLocation: r.eventLocation,
				waiverUrls,
			}).catch((err) =>
				logger.error("cron", "Failed to send 1-day event reminder", {
					to: r.clientEmail,
					error: String(err),
				}),
			);

			results.event1DayReminders++;
		}
	} catch (err) {
		logger.error("cron", "1-day event reminders failed", { error: String(err) });
	}

	// --- 4. Membership Expiry (7 days after) ---
	try {
		const expired = await getRecentlyExpiredMemberships();

		for (const m of expired) {
			if (!m.email || !m.expiresAt) continue;

			await db.update(memberships).set({ status: "expired" }).where(eq(memberships.id, m.id));

			sendMembershipExpiredEmail({
				to: m.email,
				firstName: m.firstName,
				type: m.type as "annual" | "lifetime",
				expiresAt: m.expiresAt,
			}).catch((err) =>
				logger.error("cron", "Failed to send membership expiry email", {
					to: m.email,
					error: String(err),
				}),
			);

			results.membershipExpiry++;
		}
	} catch (err) {
		logger.error("cron", "Membership expiry failed", { error: String(err) });
	}

	// --- 5. Post-Event Volunteer Thank You (yesterday's volunteer events) ---
	try {
		const volunteers = await getYesterdayVolunteerEventRegistrants();

		for (const v of volunteers) {
			if (!v.clientEmail) continue;

			sendPostEventThanksEmail({
				to: v.clientEmail,
				firstName: v.clientFirstName,
				eventTitle: v.eventTitle,
				eventDate: v.eventDate,
			}).catch((err) =>
				logger.error("cron", "Failed to send post-event thanks", {
					to: v.clientEmail,
					error: String(err),
				}),
			);

			results.postEventThanks++;
		}
	} catch (err) {
		logger.error("cron", "Post-event thanks failed", { error: String(err) });
	}

	// --- 6. Waiver Expiry — delete expired waiver records ---
	try {
		const now = new Date();
		await db.delete(clientWaivers).where(lt(clientWaivers.expiresAt, now));
		logger.info("cron", "Waiver expiry check completed");
	} catch (err) {
		logger.error("cron", "Waiver expiry failed", { error: String(err) });
	}

	return Response.json({ ok: true, ...results });
}
