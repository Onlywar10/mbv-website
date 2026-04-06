import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const teamMembers = pgTable("team_members", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	title: text("title").notNull(),
	bio: text("bio").notNull(),
	imageUrl: text("image_url").notNull(),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
