CREATE TYPE "public"."client_role" AS ENUM('volunteer', 'participant', 'member', 'donor');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('venmo', 'paypal', 'check', 'cash', 'card', 'other');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('registered', 'waitlisted', 'attended', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('fishing', 'whale-watching', 'volunteer', 'community', 'derby');--> statement-breakpoint
CREATE TABLE "client_event_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"event_title" text NOT NULL,
	"event_date" date NOT NULL,
	"event_category" text NOT NULL,
	"guest_count" integer DEFAULT 0 NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"role" "client_role" NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_roles_client_id_role_unique" UNIQUE("client_id","role")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"city" text,
	"state" text,
	"zip" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"email_opt_in" boolean DEFAULT true NOT NULL,
	"total_events_attended" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"transaction_id" text,
	"donated_at" timestamp with time zone NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"status" "registration_status" DEFAULT 'registered' NOT NULL,
	"guest_count" integer DEFAULT 0 NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"notes" text,
	CONSTRAINT "event_registrations_event_id_client_id_unique" UNIQUE("event_id","client_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"date" date NOT NULL,
	"time" text,
	"location" text,
	"category" "event_category" NOT NULL,
	"description" text,
	"long_description" text,
	"image_url" text,
	"accessibility" text,
	"spots_available" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "client_event_history" ADD CONSTRAINT "client_event_history_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_roles" ADD CONSTRAINT "client_roles_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;