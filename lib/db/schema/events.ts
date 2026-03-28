import {
	boolean,
	date,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const eventCategoryEnum = pgEnum("event_category", [
	"fishing",
	"whale-watching",
	"volunteer",
	"community",
	"derby",
]);

export const events = pgTable("events", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	date: date("date", { mode: "string" }).notNull(),
	time: text("time"),
	location: text("location"),
	category: eventCategoryEnum("category").notNull(),
	description: text("description"),
	longDescription: text("long_description"),
	imageUrl: text("image_url"),
	accessibility: text("accessibility"),
	participantCapacity: integer("participant_capacity").notNull().default(0),
	volunteerCapacity: integer("volunteer_capacity").notNull().default(0),
	volunteerEnabled: boolean("volunteer_enabled").notNull().default(false),
	volunteerDescription: text("volunteer_description"),
	volunteerTime: text("volunteer_time"),
	volunteerNotes: text("volunteer_notes"),
	isPublished: boolean("is_published").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
