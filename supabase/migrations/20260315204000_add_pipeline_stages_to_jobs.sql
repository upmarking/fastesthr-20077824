-- Add pipeline_stages column to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS pipeline_stages JSONB DEFAULT '["applied", "screening", "interview", "offer", "hired"]'::jsonb;

-- Allow any stage name in candidates (if it was an enum, we change it to text)
-- Note: We check if it is an enum first. 
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_type t 
        JOIN pg_namespace n ON n.oid = t.typnamespace 
        WHERE t.typname = 'candidate_stage' AND n.nspname = 'public'
    ) THEN
        ALTER TABLE candidates ALTER COLUMN stage SET DATA TYPE TEXT;
    END IF;
END $$;
