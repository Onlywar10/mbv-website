import { pgEnum, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const clientRoleEnum = pgEnum("client_role", [
	"volunteer",
	"participant",
	"member",
	"donor",
]);

export const clientRoles = pgTable(
	"client_roles",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		clientId: uuid("client_id")
			.notNull()
			.references(() => clients.id, { onDelete: "cascade" }),
		role: clientRoleEnum("role").notNull(),
		assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [unique("client_roles_client_id_role_unique").on(table.clientId, table.role)],
);
