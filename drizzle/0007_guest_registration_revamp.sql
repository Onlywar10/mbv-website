ALTER TABLE "event_registrations" ADD COLUMN "registered_by" uuid;

--> statement-breakpoint

ALTER TABLE "event_registrations" DROP COLUMN "guest_count";
