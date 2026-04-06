"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema/team-members";
import { logger } from "@/lib/logger";
import type { ActionState } from "@/lib/types";
import { teamMemberSchema } from "@/lib/validations/team";

export async function createTeamMemberAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;

	try {
		await db.insert(teamMembers).values({
			name: data.name,
			title: data.title,
			bio: data.bio,
			imageUrl: data.imageUrl,
			sortOrder: data.sortOrder,
		});
	} catch (err) {
		logger.error("team", "Failed to create team member", { error: String(err) });
		return { error: "Failed to create team member. Please try again." };
	}

	revalidatePath("/admin/team");
	revalidatePath("/about");

	return { success: "Team member added" };
}

export async function updateTeamMemberAction(
	id: string,
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const parsed = teamMemberSchema.safeParse(Object.fromEntries(formData));
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message };
	}

	const data = parsed.data;
	const current = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
	if (!current[0]) {
		return { error: "Team member not found" };
	}

	// Clean up old blob if image changed
	const oldImageUrl = current[0].imageUrl;
	if (oldImageUrl !== data.imageUrl && oldImageUrl.includes("blob.vercel-storage.com")) {
		try {
			await del(oldImageUrl);
		} catch (err) {
			logger.warn("team", "Failed to delete old image blob", { error: String(err) });
		}
	}

	try {
		await db
			.update(teamMembers)
			.set({
				name: data.name,
				title: data.title,
				bio: data.bio,
				imageUrl: data.imageUrl,
				sortOrder: data.sortOrder,
				updatedAt: new Date(),
			})
			.where(eq(teamMembers.id, id));
	} catch (err) {
		logger.error("team", "Failed to update team member", { id, error: String(err) });
		return { error: "Failed to update team member. Please try again." };
	}

	revalidatePath("/admin/team");
	revalidatePath("/about");

	return { success: "Team member updated" };
}

export async function deleteTeamMemberAction(id: string): Promise<ActionState> {
	await requireAuth();

	const member = await db
		.select({ imageUrl: teamMembers.imageUrl })
		.from(teamMembers)
		.where(eq(teamMembers.id, id))
		.limit(1);

	if (member[0]?.imageUrl.includes("blob.vercel-storage.com")) {
		try {
			await del(member[0].imageUrl);
		} catch (err) {
			logger.warn("team", "Failed to delete team member image blob", { error: String(err) });
		}
	}

	try {
		await db.delete(teamMembers).where(eq(teamMembers.id, id));
	} catch (err) {
		logger.error("team", "Failed to delete team member", { id, error: String(err) });
		return { error: "Failed to delete team member. Please try again." };
	}

	revalidatePath("/admin/team");
	revalidatePath("/about");

	return { success: "Team member deleted" };
}
