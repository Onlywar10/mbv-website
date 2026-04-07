import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	if (!email || !token) {
		return new Response("Invalid unsubscribe link.", { status: 400 });
	}

	if (!verifyUnsubscribeToken(email, token)) {
		logger.warn("unsubscribe", "Invalid unsubscribe token", { email });
		return new Response("Invalid or expired unsubscribe link.", { status: 403 });
	}

	try {
		await db
			.update(clients)
			.set({ emailOptIn: false })
			.where(eq(clients.email, email.toLowerCase()));
	} catch (err) {
		logger.error("unsubscribe", "Failed to process unsubscribe", { email, error: String(err) });
		return new Response("Failed to process unsubscribe request.", { status: 500 });
	}

	logger.info("unsubscribe", "Client unsubscribed", { email });

	// Redirect to the unsubscribe confirmation page
	return Response.redirect(new URL("/unsubscribe/confirmed", request.url));
}
