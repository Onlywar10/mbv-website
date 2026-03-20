import { pgTable, text, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
	id: uuid("id").defaultRandom().primaryKey(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email").notNull().unique(),
	phone: text("phone"),
	address: text("address"),
	city: text("city"),
	state: text("state"),
	zip: text("zip"),
	notes: text("notes"),
	isActive: boolean("is_active").notNull().default(true),
	emailOptIn: boolean("email_opt_in").notNull().default(true),
	totalEventsAttended: integer("total_events_attended").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
