ALTER TABLE "events" ADD COLUMN "volunteer_enabled" boolean DEFAULT false NOT NULL;

--> statement-breakpoint

ALTER TABLE "events" ADD COLUMN "volunteer_description" text;

--> statement-breakpoint

ALTER TABLE "events" ADD COLUMN "volunteer_time" text;

--> statement-breakpoint

ALTER TABLE "events" ADD COLUMN "volunteer_notes" text;
