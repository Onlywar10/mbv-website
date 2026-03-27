"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";
import type { ActionState } from "@/lib/types";

export async function createMembershipAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const firstName = (formData.get("firstName") as string)?.trim();
	const lastName = (formData.get("lastName") as string)?.trim();
	const email = (formData.get("email") as string)?.trim().toLowerCase();
	const type = formData.get("type") as "annual" | "lifetime";

	if (!firstName || !lastName || !email) {
		return { error: "Name and email are required." };
	}

	const expiresAt = type === "annual" ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null;

	await db.insert(memberships).values({
		firstName,
		lastName,
		email,
		type,
		status: "active",
		expiresAt,
	});

	revalidatePath("/admin/members");
	return {
		success: `${type === "annual" ? "Annual" : "Lifetime"} membership created for ${firstName} ${lastName}.`,
	};
}

export async function updateMembershipAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const membershipId = formData.get("membershipId") as string;
	const type = formData.get("type") as "annual" | "lifetime";
	const status = formData.get("status") as "active" | "expired" | "cancelled";
	const email = (formData.get("email") as string)?.trim().toLowerCase();
	const expiresAtRaw = formData.get("expiresAt") as string;
	const expiresAt = expiresAtRaw ? new Date(`${expiresAtRaw}T00:00:00`) : null;

	if (!membershipId) return { error: "Membership ID is required." };
	if (!email) return { error: "Email is required." };

	await db
		.update(memberships)
		.set({ type, status, email, expiresAt })
		.where(eq(memberships.id, membershipId));

	revalidatePath("/admin/members");
	return { success: "Membership updated." };
}

export async function deleteMembershipAction(membershipId: string): Promise<ActionState> {
	await requireAuth();

	await db.delete(memberships).where(eq(memberships.id, membershipId));

	revalidatePath("/admin/members");
	return { success: "Membership removed." };
}
