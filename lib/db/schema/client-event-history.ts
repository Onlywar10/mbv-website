import { date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const clientEventHistory = pgTable("client_event_history", {
	id: uuid("id").defaultRandom().primaryKey(),
	clientId: uuid("client_id")
		.notNull()
		.references(() => clients.id, { onDelete: "cascade" }),
	eventTitle: text("event_title").notNull(),
	eventDate: date("event_date", { mode: "string" }).notNull(),
	eventCategory: text("event_category").notNull(),
	guestCount: integer("guest_count").notNull().default(0),
	recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow().notNull(),
});
