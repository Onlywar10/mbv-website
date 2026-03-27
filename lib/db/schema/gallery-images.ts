import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const galleryImages = pgTable("gallery_images", {
	id: uuid("id").defaultRandom().primaryKey(),
	url: text("url").notNull(),
	alt: text("alt").default(""),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
