
-- =============================================
-- ENSURE PUBLIC ID CARD INFRASTRUCTURE
-- =============================================

DO $$ 
BEGIN
  -- 1. Ensure public_id column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='employees' AND column_name='public_id') THEN
    ALTER TABLE public.employees ADD COLUMN public_id UUID DEFAULT gen_random_uuid();
  END IF;

  -- 2. Populate public_id for existing employees who don't have one
  UPDATE public.employees SET public_id = gen_random_uuid() WHERE public_id IS NULL;

  -- 3. Add a unique index if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_employees_public_id') THEN
    CREATE UNIQUE INDEX idx_employees_public_id ON public.employees(public_id);
  END IF;
END $$;

-- 4. Storage Policies for Public ID Card Assets
-- We need to allow public (anon) read access to avatars and company logos used on ID cards

-- Ensure the bucket exists (this might fail if already exists, but we use it as a reference)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('employee-assets', 'employee-assets', true) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to employee-assets bucket
DO $$
BEGIN
  -- Try to create policy for anon read if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Public ID Card Assets Read'
  ) THEN
    CREATE POLICY "Public ID Card Assets Read"
    ON storage.objects FOR SELECT
    TO anon
    USING (bucket_id = 'employee-assets');
  END IF;
END $$;
