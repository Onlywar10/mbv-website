import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appLogs } from "@/lib/db/schema/app-logs";

export async function getRecentLogs(limit = 100) {
	return db
		.select()
		.from(appLogs)
		.orderBy(desc(appLogs.createdAt))
		.limit(limit);
}

export async function getLogsByLevel(level: "info" | "warn" | "error" | "critical", limit = 100) {
	return db
		.select()
		.from(appLogs)
		.where(eq(appLogs.level, level))
		.orderBy(desc(appLogs.createdAt))
		.limit(limit);
}
