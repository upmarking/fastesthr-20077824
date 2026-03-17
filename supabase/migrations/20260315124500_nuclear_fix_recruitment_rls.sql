-- =============================================
-- NUCLEAR FIX: Disable and re-enable RLS with minimal policies
-- This drops ALL existing policies and starts completely fresh.
-- =============================================

-- ========== DEPARTMENTS ==========
-- Disable RLS completely
ALTER TABLE public.departments DISABLE ROW LEVEL SECURITY;
-- Re-enable with a single permissive policy
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
-- Drop ALL possible policies (covering all naming conventions from all migrations)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'departments' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.departments', pol.policyname);
    END LOOP;
END $$;
-- Create simple policies
CREATE POLICY "dept_all" ON public.departments FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========== JOBS ==========
ALTER TABLE public.jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'jobs' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.jobs', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "jobs_all" ON public.jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========== CANDIDATES ==========
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'candidates' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.candidates', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "candidates_all" ON public.candidates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ========== INTERVIEWS ==========
ALTER TABLE public.interviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'interviews' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.interviews', pol.policyname);
    END LOOP;
END $$;
CREATE POLICY "interviews_all" ON public.interviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
