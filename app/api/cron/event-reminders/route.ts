import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { sendEventReminderEmail } from "@/lib/email";
import { getUpcomingEventsWithRegistrants } from "@/lib/queries/email";

export async function GET(request: Request) {
	if (!verifyCronRequest(request)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const registrants = await getUpcomingEventsWithRegistrants(2);

	let sent = 0;
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

		sent++;
	}

	return Response.json({ ok: true, sent });
}
