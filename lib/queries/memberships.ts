import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";

export async function getActiveMembership(clientId: string) {
	const result = await db
		.select()
		.from(memberships)
		.where(and(eq(memberships.clientId, clientId), eq(memberships.status, "active")))
		.limit(1);

	return result[0] ?? null;
}

export async function getMembershipByClient(clientId: string) {
	const result = await db
		.select()
		.from(memberships)
		.where(eq(memberships.clientId, clientId))
		.orderBy(desc(memberships.createdAt))
		.limit(1);

	return result[0] ?? null;
}
