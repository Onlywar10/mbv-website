import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const logLevelEnum = pgEnum("log_level", ["info", "warn", "error", "critical"]);

export const appLogs = pgTable("app_logs", {
	id: uuid("id").defaultRandom().primaryKey(),
	level: logLevelEnum("level").notNull(),
	source: text("source").notNull(),
	message: text("message").notNull(),
	metadata: text("metadata"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
