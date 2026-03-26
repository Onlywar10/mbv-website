import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const membershipTypeEnum = pgEnum("membership_type", ["annual", "lifetime"]);

export const membershipStatusEnum = pgEnum("membership_status", [
	"active",
	"expired",
	"cancelled",
]);

export const memberships = pgTable("memberships", {
	id: uuid("id").defaultRandom().primaryKey(),
	clientId: uuid("client_id")
		.notNull()
		.references(() => clients.id, { onDelete: "cascade" }),
	type: membershipTypeEnum("type").notNull(),
	status: membershipStatusEnum("status").notNull().default("active"),
	startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	givebutterId: text("givebutter_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
