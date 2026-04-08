-- Add required_waivers column to events
ALTER TABLE "events" ADD COLUMN "required_waivers" text[] DEFAULT '{}'::text[] NOT NULL;

-- Drop old volunteer columns
ALTER TABLE "events" DROP COLUMN IF EXISTS "volunteer_capacity";
ALTER TABLE "events" DROP COLUMN IF EXISTS "volunteer_enabled";
ALTER TABLE "events" DROP COLUMN IF EXISTS "volunteer_description";
ALTER TABLE "events" DROP COLUMN IF EXISTS "volunteer_time";
ALTER TABLE "events" DROP COLUMN IF EXISTS "volunteer_notes";

-- Migrate existing SmartWaiver URL to boating waiver key
UPDATE "site_settings" SET "key" = 'smartwaiver_boating_url' WHERE "key" = 'smartwaiver_waiver_url';
