import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { getWaiverDetails } from "@/lib/smartwaiver";

export async function POST(request: NextRequest) {
	const body = await request.json();

	const waiverId = body.unique_id;
	if (!waiverId) {
		return Response.json({ error: "Missing waiver ID" }, { status: 400 });
	}

	// Fetch full waiver details from SmartWaiver to get signer info
	let waiverData: any;
	try {
		waiverData = await getWaiverDetails(waiverId);
	} catch (err) {
		console.error("Failed to fetch waiver details:", err);
		return Response.json({ error: "Failed to fetch waiver" }, { status: 502 });
	}

	// Extract signer email
	const participant = waiverData?.waiver?.participants?.[0];
	const email = (participant?.email || waiverData?.waiver?.email || "").toLowerCase().trim();

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

	// Update client waiver status — expires 1 year from now
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

	await db
		.update(clients)
		.set({ waiverSignedAt: now, waiverExpiresAt: expiresAt })
		.where(eq(clients.id, clientResult[0].id));

	return Response.json({ ok: true, matched: true });
}
