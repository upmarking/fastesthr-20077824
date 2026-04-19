-- Add referred_by column to candidates table to track who added the candidate
ALTER TABLE public.candidates
ADD COLUMN referred_by UUID REFERENCES public.profiles(id);

-- Description of the change
COMMENT ON COLUMN public.candidates.referred_by IS 'Profile ID of the employee who referred this candidate';

-- Ensure all authenticated users can insert candidates (already covered by candidates_all policy but added for clarity)
-- The existing policy is: CREATE POLICY "candidates_all" ON public.candidates FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- So no additional policy is strictly needed if we want to keep it simple.
