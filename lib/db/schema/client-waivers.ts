import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const clientWaivers = pgTable(
	"client_waivers",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		clientId: uuid("client_id")
			.notNull()
			.references(() => clients.id, { onDelete: "cascade" }),
		waiverType: text("waiver_type").notNull(),
		signedAt: timestamp("signed_at", { withTimezone: true }).defaultNow().notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	},
	(table) => [
		unique("client_waivers_client_id_waiver_type_unique").on(table.clientId, table.waiverType),
	],
);
