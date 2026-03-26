import { and, desc, eq, gt, lt, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema/clients";
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

export async function getExpiringMemberships(daysOut: number) {
	return db
		.select({
			membershipId: memberships.id,
			type: memberships.type,
			expiresAt: memberships.expiresAt,
			clientEmail: clients.email,
			clientFirstName: clients.firstName,
		})
		.from(memberships)
		.innerJoin(clients, eq(memberships.clientId, clients.id))
		.where(
			and(
				eq(memberships.status, "active"),
				eq(memberships.type, "annual"),
				gt(memberships.expiresAt, new Date()),
				lt(memberships.expiresAt, sql`NOW() + ${`${daysOut} days`}::interval`),
			),
		);
}
