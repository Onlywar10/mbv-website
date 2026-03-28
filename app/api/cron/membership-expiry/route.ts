import { eq } from "drizzle-orm";
import { verifyCronRequest } from "@/lib/auth/verify-cron";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";
import { sendMembershipExpiredEmail } from "@/lib/email";
import { getRecentlyExpiredMemberships } from "@/lib/queries/email";

export async function GET(request: Request) {
	if (!verifyCronRequest(request)) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	const expired = await getRecentlyExpiredMemberships();

	let sent = 0;
	for (const m of expired) {
		if (!m.email || !m.expiresAt) continue;

		// Update status to expired
		await db
			.update(memberships)
			.set({ status: "expired" })
			.where(eq(memberships.id, m.id));

		// Send notification
		sendMembershipExpiredEmail({
			to: m.email,
			firstName: m.firstName,
			type: m.type as "annual" | "lifetime",
			expiresAt: m.expiresAt,
		}).catch(console.error);

		sent++;
	}

	return Response.json({ ok: true, sent });
}
