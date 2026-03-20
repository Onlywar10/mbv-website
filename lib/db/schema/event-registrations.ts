import { pgTable, pgEnum, text, integer, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { events } from "./events";

export const registrationStatusEnum = pgEnum("registration_status", [
	"registered",
	"waitlisted",
	"attended",
	"cancelled",
]);

export const eventRegistrations = pgTable(
	"event_registrations",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		eventId: uuid("event_id")
			.notNull()
			.references(() => events.id, { onDelete: "cascade" }),
		clientId: uuid("client_id")
			.notNull()
			.references(() => clients.id, { onDelete: "cascade" }),
		status: registrationStatusEnum("status").notNull().default("registered"),
		guestCount: integer("guest_count").notNull().default(0),
		registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow().notNull(),
		notes: text("notes"),
	},
	(table) => [
		unique("event_registrations_event_id_client_id_unique").on(table.eventId, table.clientId),
	],
);
