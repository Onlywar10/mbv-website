import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema/site-settings";

export async function getSetting(key: string): Promise<string | null> {
	const result = await db
		.select({ value: siteSettings.value })
		.from(siteSettings)
		.where(eq(siteSettings.key, key))
		.limit(1);

	return result[0]?.value ?? null;
}

/**
 * Get notification emails for a given category.
 * Falls back to all active admin emails if the setting is empty.
 */
export async function getNotificationEmails(key: string): Promise<string[]> {
	const value = await getSetting(key);
	if (value) {
		const emails = value
			.split(",")
			.map((e) => e.trim())
			.filter(Boolean);
		if (emails.length > 0) return emails;
	}

	// Fallback: import lazily to avoid circular deps
	const { getActiveAdminEmails } = await import("@/lib/queries/email");
	const admins = await getActiveAdminEmails();
	return admins.map((a) => a.email);
}

export async function getNotificationSettings() {
	const [contact, events, membershipDonation] = await Promise.all([
		getSetting("notify_contact"),
		getSetting("notify_events"),
		getSetting("notify_membership_donation"),
	]);

	return {
		contact: contact ?? "",
		events: events ?? "",
		membershipDonation: membershipDonation ?? "",
	};
}

export async function getGivebutterCampaignCodes() {
	const [annual, lifetime] = await Promise.all([
		getSetting("givebutter_annual_campaign"),
		getSetting("givebutter_lifetime_campaign"),
	]);

	return { annual, lifetime };
}
