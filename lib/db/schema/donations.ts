import { numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const paymentMethodEnum = pgEnum("payment_method", [
	"venmo",
	"paypal",
	"check",
	"cash",
	"card",
	"other",
]);

export const donations = pgTable("donations", {
	id: uuid("id").defaultRandom().primaryKey(),
	clientId: uuid("client_id").references(() => clients.id, { onDelete: "set null" }),
	amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
	paymentMethod: paymentMethodEnum("payment_method").notNull(),
	transactionId: text("transaction_id"),
	donatedAt: timestamp("donated_at", { withTimezone: true }).notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
