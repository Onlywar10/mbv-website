import { and, desc, eq } from "drizzle-orm";

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

export async function getAllMemberships() {
	return db
		.select({
			id: memberships.id,
			clientId: clients.id,
			firstName: clients.firstName,
			lastName: clients.lastName,
			email: clients.email,
			type: memberships.type,
			status: memberships.status,
			startedAt: memberships.startedAt,
			expiresAt: memberships.expiresAt,
		})
		.from(memberships)
		.innerJoin(clients, eq(memberships.clientId, clients.id))
		.orderBy(desc(memberships.createdAt));
}
