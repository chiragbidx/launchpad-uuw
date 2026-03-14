CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" text NOT NULL,
  "name" text NOT NULL,
  "status" text NOT NULL DEFAULT 'Planned',
  "owner" text,
  "progress" text NOT NULL DEFAULT '0',
  "description" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);