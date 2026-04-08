import { and, eq, gt } from "drizzle-orm";

import { db } from "@/lib/db";
import { clientWaivers } from "@/lib/db/schema/client-waivers";

/** Get all valid (non-expired) waivers for a client. */
export async function getClientWaivers(clientId: string) {
	return db
		.select({
			waiverType: clientWaivers.waiverType,
			signedAt: clientWaivers.signedAt,
			expiresAt: clientWaivers.expiresAt,
		})
		.from(clientWaivers)
		.where(eq(clientWaivers.clientId, clientId));
}

/** Check which of the required waivers a client is missing or have expired. */
export async function getMissingWaivers(
	clientId: string,
	requiredWaivers: string[],
): Promise<string[]> {
	if (requiredWaivers.length === 0) return [];

	const now = new Date();
	const valid = await db
		.select({ waiverType: clientWaivers.waiverType })
		.from(clientWaivers)
		.where(and(eq(clientWaivers.clientId, clientId), gt(clientWaivers.expiresAt, now)));

	const validTypes = new Set(valid.map((w) => w.waiverType));
	return requiredWaivers.filter((w) => !validTypes.has(w));
}
