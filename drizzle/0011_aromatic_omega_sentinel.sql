CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio" text NOT NULL,
	"image_url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "waiver_signed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "waiver_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "event_registrations" DROP COLUMN IF EXISTS "waiver_signed_at";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN IF EXISTS "waiver_required";
