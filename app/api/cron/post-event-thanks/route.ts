import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { sendPostEventThanksEmail } from "@/lib/email";
import { getYesterdayEventsWithVolunteers } from "@/lib/queries/email";

export async function GET(request: Request) {
	if (!verifyCronRequest(request)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const volunteers = await getYesterdayEventsWithVolunteers();

	let sent = 0;
	for (const v of volunteers) {
		if (!v.clientEmail) continue;

		sendPostEventThanksEmail({
			to: v.clientEmail,
			firstName: v.clientFirstName,
			eventTitle: v.eventTitle,
			eventDate: v.eventDate,
		}).catch(console.error);

		sent++;
	}

	return Response.json({ ok: true, sent });
}
