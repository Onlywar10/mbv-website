-- Create registration_role enum
CREATE TYPE "public"."registration_role" AS ENUM('participant', 'volunteer');

--> statement-breakpoint

-- Add role column to event_registrations (default participant for existing rows)
ALTER TABLE "event_registrations" ADD COLUMN "role" "registration_role" DEFAULT 'participant' NOT NULL;

--> statement-breakpoint

-- Drop old unique constraint (event_id, client_id)
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_event_id_client_id_unique";

--> statement-breakpoint

-- Add new unique constraint (event_id, client_id, role)
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_client_id_role_unique" UNIQUE("event_id","client_id","role");

--> statement-breakpoint

-- Replace spots_available with participant_capacity and volunteer_capacity
ALTER TABLE "events" ADD COLUMN "participant_capacity" integer DEFAULT 0 NOT NULL;

--> statement-breakpoint

ALTER TABLE "events" ADD COLUMN "volunteer_capacity" integer DEFAULT 0 NOT NULL;

--> statement-breakpoint

-- Migrate existing data: copy spots_available into participant_capacity
UPDATE "events" SET "participant_capacity" = "spots_available";

--> statement-breakpoint

ALTER TABLE "events" DROP COLUMN "spots_available";
