-- Add stage_automations column to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS stage_automations JSONB DEFAULT '{}'::jsonb;
