import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { logger } from "@/lib/logger";
import { getWaiverDetails } from "@/lib/smartwaiver";

/**
 * Try to find a client by email first, then fall back to first + last name match.
 * SmartWaiver signers may use a different email than what's in our client DB,
 * so name matching ensures waivers still get linked.
 */
async function findClientByWaiver(email: string, firstName: string, lastName: string) {
	// Primary: match by email
	if (email) {
		const byEmail = await db
			.select({ id: clients.id })
			.from(clients)
			.where(eq(clients.email, email))
			.limit(1);

		if (byEmail[0]) return byEmail[0];
	}

	// Fallback: match by first + last name
	if (firstName && lastName) {
		const byName = await db
			.select({ id: clients.id })
			.from(clients)
			.where(and(eq(clients.firstName, firstName), eq(clients.lastName, lastName)))
			.limit(1);

		if (byName[0]) {
			logger.info("smartwaiver", "Matched client by name fallback", { firstName, lastName });
			return byName[0];
		}
	}

	return null;
}

export async function POST(request: NextRequest) {
	const body = await request.json();

	let email = "";
	let firstName = "";
	let lastName = "";

	if (body._test_email && process.env.NODE_ENV !== "production") {
		// Dev-only: accept email directly for local testing without a real waiver
		email = body._test_email.toLowerCase().trim();
		firstName = body._test_firstName?.trim() || "";
		lastName = body._test_lastName?.trim() || "";
	} else {
		// Production: webhook sends unique_id, we fetch full waiver from SmartWaiver API.
		// The API call itself authenticates the webhook — a forged unique_id would 404.
		const waiverId = body.unique_id;
		if (!waiverId) {
			return Response.json({ error: "Missing waiver ID" }, { status: 400 });
		}

		let waiverData: any;
		try {
			waiverData = await getWaiverDetails(waiverId);
		} catch (err) {
			logger.error("smartwaiver", "Failed to fetch waiver details", {
				waiverId,
				error: String(err),
			});
			return Response.json({ error: "Failed to fetch waiver" }, { status: 502 });
		}

		// Email is at waiver root level, name fields on both root and participants
		const waiver = waiverData?.waiver;
		email = (waiver?.email || "").toLowerCase().trim();
		firstName = (waiver?.firstName || waiver?.participants?.[0]?.firstName || "").trim();
		lastName = (waiver?.lastName || waiver?.participants?.[0]?.lastName || "").trim();
	}

	if (!email && !firstName) {
		return Response.json({ error: "No identifying info in waiver" }, { status: 400 });
	}

	const client = await findClientByWaiver(email, firstName, lastName);

	if (!client) {
		logger.warn("smartwaiver", "No matching client found for waiver", {
			email,
			firstName,
			lastName,
		});
		return Response.json({ ok: true, matched: false });
	}

	// Update client waiver status — expires 1 year from now
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

	await db
		.update(clients)
		.set({ waiverSignedAt: now, waiverExpiresAt: expiresAt })
		.where(eq(clients.id, client.id));

	logger.info("smartwaiver", "Waiver processed successfully", {
		clientId: client.id,
		email,
		expiresAt: expiresAt.toISOString(),
	});

	return Response.json({ ok: true, matched: true });
}
