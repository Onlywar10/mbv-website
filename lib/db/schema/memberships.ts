import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const membershipTypeEnum = pgEnum("membership_type", ["annual", "lifetime"]);

export const membershipStatusEnum = pgEnum("membership_status", ["active", "expired", "cancelled"]);

export const memberships = pgTable("memberships", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull(),
	clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
	type: membershipTypeEnum("type").notNull(),
	status: membershipStatusEnum("status").notNull().default("active"),
	startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	givebutterId: text("givebutter_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
