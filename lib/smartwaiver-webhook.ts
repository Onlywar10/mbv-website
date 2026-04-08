import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { clientWaivers } from "@/lib/db/schema/client-waivers";
import { clients } from "@/lib/db/schema/clients";
import { logger } from "@/lib/logger";
import { getWaiverDetails } from "@/lib/smartwaiver";

/**
 * Try to find a client by email first, then fall back to first + last name match.
 */
async function findClientByWaiver(email: string, firstName: string, lastName: string) {
	if (email) {
		const byEmail = await db
			.select({ id: clients.id })
			.from(clients)
			.where(eq(clients.email, email))
			.limit(1);

		if (byEmail[0]) return byEmail[0];
	}

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

/**
 * Shared handler for SmartWaiver webhook events.
 * Called by waiver-type-specific routes.
 */
export async function handleSmartWaiverWebhook(
	request: Request,
	waiverType: string,
): Promise<Response> {
	const contentType = request.headers.get("content-type") ?? "";
	const rawBody = await request.clone().text();

	logger.info("smartwaiver", `Webhook raw (${waiverType})`, {
		waiverType,
		contentType,
		bodyPreview: rawBody.slice(0, 500),
	});

	let body: Record<string, any>;

	if (contentType.includes("application/json")) {
		try {
			body = await request.json();
		} catch {
			return Response.json({ error: "Invalid JSON" }, { status: 400 });
		}
	} else {
		// SmartWaiver sends application/x-www-form-urlencoded
		const formData = await request.formData();
		body = Object.fromEntries(formData.entries());
	}

	if (typeof body !== "object" || body === null) {
		return Response.json({ error: "Invalid payload" }, { status: 400 });
	}

	logger.info("smartwaiver", `Webhook received (${waiverType})`, {
		waiverType,
		uniqueId: body.unique_id ?? "none",
		event: body.event ?? "none",
	});

	let email = "";
	let firstName = "";
	let lastName = "";

	if (body._test_email && process.env.NODE_ENV !== "production") {
		email = body._test_email.toLowerCase().trim();
		firstName = body._test_firstName?.trim() || "";
		lastName = body._test_lastName?.trim() || "";
	} else {
		const waiverId = body.unique_id;
		if (!waiverId) {
			logger.warn("smartwaiver", `Missing unique_id in webhook (${waiverType})`, {
				waiverType,
				bodyPreview: JSON.stringify(body).slice(0, 200),
			});
			return Response.json({ error: "Missing waiver ID" }, { status: 400 });
		}

		let waiverData: any;
		try {
			waiverData = await getWaiverDetails(waiverId);
		} catch (err) {
			logger.error("smartwaiver", "Failed to fetch waiver details", {
				waiverId,
				waiverType,
				error: String(err),
			});
			return Response.json({ error: "Failed to fetch waiver" }, { status: 502 });
		}

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
			waiverType,
		});
		return Response.json({ ok: true, matched: false });
	}

	// Upsert waiver record — expires 1 year from now
	const now = new Date();
	const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

	await db
		.insert(clientWaivers)
		.values({ clientId: client.id, waiverType, signedAt: now, expiresAt })
		.onConflictDoUpdate({
			target: [clientWaivers.clientId, clientWaivers.waiverType],
			set: { signedAt: now, expiresAt },
		});

	logger.info("smartwaiver", `${waiverType} waiver processed`, {
		clientId: client.id,
		email,
		waiverType,
		expiresAt: expiresAt.toISOString(),
	});

	return Response.json({ ok: true, matched: true, waiverType });
}
