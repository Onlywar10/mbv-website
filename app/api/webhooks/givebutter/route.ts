import { createHmac } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";
import { memberships } from "@/lib/db/schema/memberships";
import {
	sendAdminDonationNotification,
	sendAdminMembershipNotification,
	sendDonationThankYouEmail,
	sendMembershipConfirmationEmail,
} from "@/lib/email";
import { logger } from "@/lib/logger";
import { findClientByEmail } from "@/lib/queries/clients";
import { getGivebutterCampaignCodes, getNotificationEmails } from "@/lib/queries/settings";

function verifySignature(payload: string, signature: string | null): boolean {
	const secret = process.env.GIVEBUTTER_WEBHOOK_SECRET;
	if (!secret || !signature) return false;

	const expected = createHmac("sha256", secret).update(payload).digest("hex");
	return expected === signature;
}

export async function POST(request: NextRequest) {
	const rawBody = await request.text();
	const signature = request.headers.get("x-givebutter-signature");

	// Verify webhook authenticity — require secret in production
	if (!process.env.GIVEBUTTER_WEBHOOK_SECRET) {
		if (process.env.NODE_ENV === "production") {
			return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
		}
	} else if (!verifySignature(rawBody, signature)) {
		return Response.json({ error: "Invalid signature" }, { status: 401 });
	}

	let payload: any;
	try {
		payload = JSON.parse(rawBody);
	} catch {
		return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
	}

	const transaction = payload.data ?? payload;

	logger.info("givebutter", "Webhook received", {
		transactionId: String(transaction.id ?? ""),
		status: transaction.status ?? "unknown",
	});

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

	if (!Number.isFinite(amount) || amount <= 0) {
		return Response.json({ error: "Invalid donation amount" }, { status: 400 });
	}

	// Find or create client
	let clientId: string;
	try {
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

			if (!result[0]?.id) {
				return Response.json({ error: "Failed to create client" }, { status: 500 });
			}
			clientId = result[0].id;
		}
	} catch (err) {
		logger.error("givebutter", "Failed to find or create client", { email, error: String(err) });
		return Response.json({ error: "Failed to process client" }, { status: 500 });
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

	const donatedAt = transaction.transacted_at ? new Date(transaction.transacted_at) : new Date();

	try {
		await db.insert(donations).values({
			clientId,
			amount: String(amount),
			paymentMethod,
			transactionId,
			donatedAt,
			notes: donationNote,
		});
	} catch (err) {
		logger.error("givebutter", "Failed to record donation", {
			email,
			amount: String(amount),
			error: String(err),
		});
		return Response.json({ error: "Failed to record donation" }, { status: 500 });
	}

	logger.info("givebutter", "Donation recorded", {
		email,
		amount: String(amount),
		paymentMethod,
		transactionId,
	});

	// Send donation thank-you and admin notification for non-membership donations
	if (!membershipType) {
		// Notify admins
		getNotificationEmails("notify_membership_donation")
			.then((adminEmails) => {
				if (adminEmails.length === 0) return;

				sendAdminDonationNotification({
					adminEmails,
					donorName: `${firstName} ${lastName}`,
					donorEmail: email,
					amount: String(amount),
					paymentMethod,
				}).catch((err) =>
					logger.error("givebutter", "Failed to send admin donation notification", {
						email,
						error: String(err),
					}),
				);
			})
			.catch((err) =>
				logger.error("givebutter", "Failed to get notification emails for donation", {
					error: String(err),
				}),
			);

		sendDonationThankYouEmail({
			to: email,
			firstName,
			amount: String(amount),
		}).catch((err) =>
			logger.error("givebutter", "Failed to send donation thank-you", {
				to: email,
				error: String(err),
			}),
		);
	}

	if (membershipType) {
		// Check for existing active membership by email to handle renewals
		const existingMembership = await db
			.select({ id: memberships.id, expiresAt: memberships.expiresAt })
			.from(memberships)
			.where(
				and(
					eq(memberships.email, email.toLowerCase()),
					eq(memberships.type, membershipType),
					eq(memberships.status, "active"),
				),
			)
			.limit(1);

		let expiresAt: Date | null = null;

		if (membershipType === "annual") {
			if (existingMembership[0]?.expiresAt && existingMembership[0].expiresAt > new Date()) {
				expiresAt = new Date(existingMembership[0].expiresAt.getTime() + 365 * 24 * 60 * 60 * 1000);
			} else {
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
				firstName,
				lastName,
				email: email.toLowerCase(),
				clientId,
				type: membershipType,
				status: "active",
				expiresAt,
				givebutterId: transactionId,
			});
		}

		logger.info("givebutter", "Membership processed", {
			email,
			type: membershipType,
			isRenewal: !!existingMembership[0],
			transactionId,
		});

		// Send confirmation email to member
		sendMembershipConfirmationEmail({
			to: email,
			firstName,
			type: membershipType,
			expiresAt,
		}).catch((err) =>
			logger.error("givebutter", "Failed to send membership confirmation", {
				to: email,
				error: String(err),
			}),
		);

		// Notify admins of new/renewed membership
		getNotificationEmails("notify_membership_donation")
			.then((adminEmails) => {
				if (adminEmails.length === 0) return;

				sendAdminMembershipNotification({
					adminEmails,
					memberName: `${firstName} ${lastName}`,
					memberEmail: email,
					type: membershipType!,
					isRenewal: !!existingMembership[0],
					expiresAt,
					amount: String(amount),
				}).catch((err) =>
					logger.error("givebutter", "Failed to send admin membership notification", {
						email,
						error: String(err),
					}),
				);
			})
			.catch((err) =>
				logger.error("givebutter", "Failed to get notification emails for membership", {
					error: String(err),
				}),
			);
	}

	return Response.json({ ok: true });
}
