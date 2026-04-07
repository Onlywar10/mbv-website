"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { memberships } from "@/lib/db/schema/memberships";
import { logger } from "@/lib/logger";
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

	try {
		await db.insert(memberships).values({
			firstName,
			lastName,
			email,
			type,
			status: "active",
			expiresAt,
		});
	} catch (err) {
		logger.error("memberships", "Failed to create membership", { email, type, error: String(err) });
		return { error: "Failed to create membership. Please try again." };
	}

	logger.info("memberships", "Membership created", {
		email,
		type,
		name: `${firstName} ${lastName}`,
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

	try {
		await db
			.update(memberships)
			.set({ type, status, email, expiresAt })
			.where(eq(memberships.id, membershipId));
	} catch (err) {
		logger.error("memberships", "Failed to update membership", {
			membershipId,
			error: String(err),
		});
		return { error: "Failed to update membership. Please try again." };
	}

	logger.info("memberships", "Membership updated", { membershipId, type, status });
	revalidatePath("/admin/members");
	return { success: "Membership updated." };
}

export async function deleteMembershipAction(membershipId: string): Promise<ActionState> {
	await requireAuth();

	try {
		await db.delete(memberships).where(eq(memberships.id, membershipId));
	} catch (err) {
		logger.error("memberships", "Failed to delete membership", {
			membershipId,
			error: String(err),
		});
		return { error: "Failed to delete membership. Please try again." };
	}

	logger.info("memberships", "Membership deleted", { membershipId });
	revalidatePath("/admin/members");
	return { success: "Membership removed." };
}
