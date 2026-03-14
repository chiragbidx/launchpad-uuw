CREATE TABLE IF NOT EXISTS "clients" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" text NOT NULL,
  "name" text NOT NULL,
  "email" text,
  "phone" text,
  "contact_name" text,
  "notes" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);