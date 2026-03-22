import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { clientEventHistory } from "@/lib/db/schema/client-event-history";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { clients } from "@/lib/db/schema/clients";
import { donations } from "@/lib/db/schema/donations";

export async function getClients() {
	return db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function findClientByEmail(email: string) {
	const result = await db
		.select()
		.from(clients)
		.where(eq(sql`lower(${clients.email})`, email.toLowerCase()))
		.limit(1);
	return result[0] ?? null;
}

export async function getClientById(id: string) {
	const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
	return result[0] ?? null;
}

export async function getClientRoles(clientId: string) {
	return db.select().from(clientRoles).where(eq(clientRoles.clientId, clientId));
}

export async function getClientWithRoles(id: string) {
	const client = await getClientById(id);
	if (!client) return null;
	const roles = await getClientRoles(id);
	return { ...client, roles: roles.map((r) => r.role) };
}

export async function getClientEventHistory(clientId: string) {
	return db
		.select()
		.from(clientEventHistory)
		.where(eq(clientEventHistory.clientId, clientId))
		.orderBy(desc(clientEventHistory.eventDate));
}

export async function getClientDonations(clientId: string) {
	return db
		.select()
		.from(donations)
		.where(eq(donations.clientId, clientId))
		.orderBy(desc(donations.donatedAt));
}

export async function getAllDonations() {
	return db
		.select({
			id: donations.id,
			clientId: donations.clientId,
			firstName: clients.firstName,
			lastName: clients.lastName,
			amount: donations.amount,
			paymentMethod: donations.paymentMethod,
			transactionId: donations.transactionId,
			donatedAt: donations.donatedAt,
			notes: donations.notes,
			createdAt: donations.createdAt,
		})
		.from(donations)
		.leftJoin(clients, eq(donations.clientId, clients.id))
		.orderBy(desc(donations.donatedAt));
}
