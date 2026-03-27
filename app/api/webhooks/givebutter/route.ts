import { createHmac } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";
import { memberships } from "@/lib/db/schema/memberships";
import { sendMembershipConfirmationEmail } from "@/lib/email";
import { findClientByEmail } from "@/lib/queries/clients";
import { getGivebutterCampaignCodes } from "@/lib/queries/settings";

function verifySignature(payload: string, signature: string | null): boolean {
	const secret = process.env.GIVEBUTTER_WEBHOOK_SECRET;
	if (!secret || !signature) return false;

	const expected = createHmac("sha256", secret).update(payload).digest("hex");
	return expected === signature;
}

export async function POST(request: NextRequest) {
	const rawBody = await request.text();
	const signature = request.headers.get("x-givebutter-signature");

	// Verify webhook authenticity if secret is configured
	if (process.env.GIVEBUTTER_WEBHOOK_SECRET) {
		if (!verifySignature(rawBody, signature)) {
			return Response.json({ error: "Invalid signature" }, { status: 401 });
		}
	}

	const payload = JSON.parse(rawBody);
	const transaction = payload.data ?? payload;

	// Only process succeeded transactions
	if (transaction.status && transaction.status !== "succeeded") {
		return Response.json({ ok: true });
	}

	const email = transaction.email;
	const firstName = transaction.first_name;
	const lastName = transaction.last_name;
	const amount = Number.parseFloat(transaction.amount);
	const method = transaction.method ?? "other";
	const transactionId = String(transaction.id ?? transaction.number ?? "");
	const campaignCode = transaction.campaign_code ?? "";

	if (!email || !firstName || !lastName) {
		return Response.json({ error: "Missing required fields" }, { status: 400 });
	}

	// Find or create client
	let clientId: string;
	const existing = await findClientByEmail(email);
	if (existing) {
		clientId = existing.id;
	} else {
		const result = await db
			.insert(clients)
			.values({
				firstName,
				lastName,
				email: email.toLowerCase(),
				isActive: true,
				emailOptIn: true,
			})
			.returning({ id: clients.id });
		clientId = result[0].id;
	}

	// Record donation
	const paymentMethod = (["venmo", "paypal", "check", "cash", "card", "other"] as const).includes(
		method,
	)
		? (method as "venmo" | "paypal" | "check" | "cash" | "card" | "other")
		: "other";

	// Determine if this is a membership payment by matching campaign code
	const campaignCodes = await getGivebutterCampaignCodes();
	let membershipType: "annual" | "lifetime" | null = null;

	if (campaignCodes.annual && campaignCode === campaignCodes.annual) {
		membershipType = "annual";
	} else if (campaignCodes.lifetime && campaignCode === campaignCodes.lifetime) {
		membershipType = "lifetime";
	}

	const donationNote = membershipType
		? `Membership — ${membershipType === "annual" ? "Annual" : "Lifetime"}`
		: "Donation";

	await db.insert(donations).values({
		clientId,
		amount: String(amount),
		paymentMethod,
		transactionId,
		donatedAt: new Date(transaction.transacted_at ?? Date.now()),
		notes: donationNote,
	});

	if (membershipType) {
		// Check for existing active membership to handle renewals
		const existingMembership = await db
			.select({ id: memberships.id, expiresAt: memberships.expiresAt })
			.from(memberships)
			.where(
				and(
					eq(memberships.clientId, clientId),
					eq(memberships.type, membershipType),
					eq(memberships.status, "active"),
				),
			)
			.limit(1);

		let expiresAt: Date | null = null;

		if (membershipType === "annual") {
			if (existingMembership[0]?.expiresAt && existingMembership[0].expiresAt > new Date()) {
				// Extend from current expiration
				expiresAt = new Date(existingMembership[0].expiresAt.getTime() + 365 * 24 * 60 * 60 * 1000);
			} else {
				// New or expired — start from now
				expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
			}
		}

		if (existingMembership[0]) {
			// Renewal — update existing membership
			await db
				.update(memberships)
				.set({ expiresAt, status: "active", givebutterId: transactionId })
				.where(eq(memberships.id, existingMembership[0].id));
		} else {
			// New membership
			await db.insert(memberships).values({
				clientId,
				type: membershipType,
				status: "active",
				expiresAt,
				givebutterId: transactionId,
			});
		}

		// Assign "member" role if not already assigned
		const hasRole = await db
			.select({ id: clientRoles.id })
			.from(clientRoles)
			.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "member")))
			.limit(1);

		if (hasRole.length === 0) {
			await db.insert(clientRoles).values({ clientId, role: "member" });
		}

		// Send confirmation email
		sendMembershipConfirmationEmail({
			to: email,
			firstName,
			type: membershipType,
			expiresAt,
		}).catch(console.error);
	}

	return Response.json({ ok: true });
}
