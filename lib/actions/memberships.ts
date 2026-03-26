"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { clientRoles } from "@/lib/db/schema/client-roles";
import { memberships } from "@/lib/db/schema/memberships";
import type { ActionState } from "@/lib/types";

export async function assignMembershipAction(
	clientId: string,
	type: "annual" | "lifetime",
): Promise<ActionState> {
	await requireAuth();

	const expiresAt = type === "annual" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null;

	await db.insert(memberships).values({
		clientId,
		type,
		status: "active",
		expiresAt,
	});

	// Assign "member" role if not already assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "member")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "member" });
	}

	revalidatePath(`/admin/clients/${clientId}`);
	return { success: `${type === "annual" ? "Annual" : "Lifetime"} membership assigned.` };
}

export async function revokeMembershipAction(
	membershipId: string,
	clientId: string,
): Promise<ActionState> {
	await requireAuth();

	await db.update(memberships).set({ status: "cancelled" }).where(eq(memberships.id, membershipId));

	// Remove "member" role
	await db
		.delete(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "member")));

	revalidatePath(`/admin/clients/${clientId}`);
	return { success: "Membership revoked." };
}

export async function renewMembershipAction(
	membershipId: string,
	clientId: string,
): Promise<ActionState> {
	await requireAuth();

	const existing = await db
		.select({ expiresAt: memberships.expiresAt })
		.from(memberships)
		.where(eq(memberships.id, membershipId))
		.limit(1);

	if (!existing[0]) {
		return { error: "Membership not found." };
	}

	// Extend from current expiration or from now if already expired
	const base =
		existing[0].expiresAt && existing[0].expiresAt > new Date()
			? existing[0].expiresAt
			: new Date();
	const newExpiry = new Date(base.getTime() + 365 * 24 * 60 * 60 * 1000);

	await db
		.update(memberships)
		.set({ status: "active", expiresAt: newExpiry })
		.where(eq(memberships.id, membershipId));

	// Ensure "member" role is assigned
	const hasRole = await db
		.select({ id: clientRoles.id })
		.from(clientRoles)
		.where(and(eq(clientRoles.clientId, clientId), eq(clientRoles.role, "member")))
		.limit(1);

	if (hasRole.length === 0) {
		await db.insert(clientRoles).values({ clientId, role: "member" });
	}

	revalidatePath(`/admin/clients/${clientId}`);
	return { success: `Membership renewed until ${newExpiry.toLocaleDateString()}.` };
}
