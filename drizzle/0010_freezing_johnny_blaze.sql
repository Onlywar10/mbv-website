ALTER TABLE "memberships" DROP CONSTRAINT "memberships_client_id_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "memberships" ALTER COLUMN "client_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD COLUMN "waiver_signed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "waiver_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;