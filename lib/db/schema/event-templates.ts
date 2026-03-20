import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { eventCategoryEnum } from "./events";

export const eventTemplates = pgTable("event_templates", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	title: text("title").notNull(),
	location: text("location"),
	category: eventCategoryEnum("category").notNull(),
	description: text("description"),
	longDescription: text("long_description"),
	imageUrl: text("image_url"),
	accessibility: text("accessibility"),
	defaultSpots: integer("default_spots").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
