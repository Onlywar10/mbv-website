-- Create client_waivers table for per-waiver-type tracking
CREATE TABLE "client_waivers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "client_id" uuid NOT NULL REFERENCES "clients"("id") ON DELETE CASCADE,
  "waiver_type" text NOT NULL,
  "signed_at" timestamp with time zone DEFAULT now() NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  CONSTRAINT "client_waivers_client_id_waiver_type_unique" UNIQUE ("client_id", "waiver_type")
);

-- Migrate existing waiver data from clients table
INSERT INTO "client_waivers" ("client_id", "waiver_type", "signed_at", "expires_at")
SELECT "id", 'boating', "waiver_signed_at", "waiver_expires_at"
FROM "clients"
WHERE "waiver_signed_at" IS NOT NULL AND "waiver_expires_at" IS NOT NULL;

-- Drop old waiver columns from clients
ALTER TABLE "clients" DROP COLUMN IF EXISTS "waiver_signed_at";
ALTER TABLE "clients" DROP COLUMN IF EXISTS "waiver_expires_at";
