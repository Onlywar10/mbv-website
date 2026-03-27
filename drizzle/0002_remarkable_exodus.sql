CREATE TABLE "event_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"location" text,
	"category" "event_category" NOT NULL,
	"description" text,
	"long_description" text,
	"image_url" text,
	"accessibility" text,
	"default_spots" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
