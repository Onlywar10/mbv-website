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

export async function getGivebutterCampaignCodes() {
	const [annual, lifetime] = await Promise.all([
		getSetting("givebutter_annual_campaign"),
		getSetting("givebutter_lifetime_campaign"),
	]);

	return { annual, lifetime };
}
