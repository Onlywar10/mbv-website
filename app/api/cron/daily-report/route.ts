import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { sendDailyRegistrationReport } from "@/lib/email";
import { getActiveAdminEmails, getWaitlistedRegistrations } from "@/lib/queries/email";
import { getNotificationEmails } from "@/lib/queries/settings";

function getBaseUrl(): string {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
	return "http://localhost:3000";
}

export async function GET(request: Request) {
	if (!verifyCronRequest(request)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const [registrations, adminEmails] = await Promise.all([
		getWaitlistedRegistrations(),
		getNotificationEmails("notify_events"),
	]);

	if (adminEmails.length === 0 || registrations.length === 0) {
		return Response.json({ ok: true, sent: 0, reason: "No registrations or no admin emails" });
	}

	// Group registrations by event
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

	return Response.json({ ok: true, sent: adminEmails.length });
}
