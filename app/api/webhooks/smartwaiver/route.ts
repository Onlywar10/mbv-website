import { and, eq, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { eventRegistrations } from "@/lib/db/schema/event-registrations";
import { getSetting } from "@/lib/queries/settings";
import { getWaiverDetails } from "@/lib/smartwaiver";

export async function POST(request: NextRequest) {
	const body = await request.json();

	const waiverId = body.unique_id;
	if (!waiverId) {
		return Response.json({ error: "Missing waiver ID" }, { status: 400 });
	}

	const apiKey = await getSetting("smartwaiver_api_key");
	if (!apiKey) {
		return Response.json({ error: "SmartWaiver API key not configured" }, { status: 500 });
	}

	// Fetch full waiver details from SmartWaiver to get signer info
	let waiverData: any;
	try {
		waiverData = await getWaiverDetails(waiverId, apiKey);
	} catch (err) {
		console.error("Failed to fetch waiver details:", err);
		return Response.json({ error: "Failed to fetch waiver" }, { status: 502 });
	}

	// Extract signer email and event tag
	const participant = waiverData?.waiver?.participants?.[0];
	const email = (participant?.email || waiverData?.waiver?.email || "").toLowerCase().trim();
	const tag = waiverData?.waiver?.tags?.[0] || "";

	if (!email) {
		return Response.json({ error: "No email in waiver" }, { status: 400 });
	}

	// Find client by email
	const clientResult = await db
		.select({ id: clients.id })
		.from(clients)
		.where(eq(clients.email, email))
		.limit(1);

	if (!clientResult[0]) {
		return Response.json({ ok: true, matched: false });
	}

	// Update matching registrations that haven't been signed yet
	const conditions = [
		eq(eventRegistrations.clientId, clientResult[0].id),
		isNull(eventRegistrations.waiverSignedAt),
	];

	// If tag contains an eventId, scope to that specific event
	if (tag) {
		conditions.push(eq(eventRegistrations.eventId, tag));
	}

	const result = await db
		.update(eventRegistrations)
		.set({ waiverSignedAt: new Date() })
		.where(and(...conditions));

	return Response.json({ ok: true, matched: true });
}
