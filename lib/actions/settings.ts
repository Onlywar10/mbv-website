"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/require-auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema/site-settings";
import type { ActionState } from "@/lib/types";

export async function updateCampaignCodesAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const annual = (formData.get("annual") as string)?.trim() || "";
	const lifetime = (formData.get("lifetime") as string)?.trim() || "";

	for (const [key, value] of [
		["givebutter_annual_campaign", annual],
		["givebutter_lifetime_campaign", lifetime],
	]) {
		if (value) {
			await db
				.insert(siteSettings)
				.values({ key, value, updatedAt: new Date() })
				.onConflictDoUpdate({
					target: siteSettings.key,
					set: { value, updatedAt: new Date() },
				});
		} else {
			await db.delete(siteSettings).where(eq(siteSettings.key, key));
		}
	}

	revalidatePath("/admin/settings");
	return { success: "Campaign codes updated." };
}

export async function updateNotificationRoutingAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const entries: [string, string][] = [
		["notify_contact", (formData.get("notify_contact") as string)?.trim() || ""],
		["notify_events", (formData.get("notify_events") as string)?.trim() || ""],
		["notify_membership_donation", (formData.get("notify_membership_donation") as string)?.trim() || ""],
	];

	for (const [key, value] of entries) {
		if (value) {
			await db
				.insert(siteSettings)
				.values({ key, value, updatedAt: new Date() })
				.onConflictDoUpdate({
					target: siteSettings.key,
					set: { value, updatedAt: new Date() },
				});
		} else {
			await db.delete(siteSettings).where(eq(siteSettings.key, key));
		}
	}

	revalidatePath("/admin/settings");
	return { success: "Notification routing updated." };
}

export async function updateSmartWaiverSettingsAction(
	_prevState: ActionState,
	formData: FormData,
): Promise<ActionState> {
	await requireAuth();

	const entries: [string, string][] = [
		["smartwaiver_waiver_url", (formData.get("smartwaiver_waiver_url") as string)?.trim() || ""],
	];

	for (const [key, value] of entries) {
		if (value) {
			await db
				.insert(siteSettings)
				.values({ key, value, updatedAt: new Date() })
				.onConflictDoUpdate({
					target: siteSettings.key,
					set: { value, updatedAt: new Date() },
				});
		} else {
			await db.delete(siteSettings).where(eq(siteSettings.key, key));
		}
	}

	revalidatePath("/admin/settings");
	return { success: "SmartWaiver settings updated." };
}
