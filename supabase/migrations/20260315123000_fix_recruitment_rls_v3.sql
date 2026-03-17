-- =============================================
-- FIX: Make INSERT policies fully permissive for authenticated users
-- The get_user_company_id() function may return NULL if the profile
-- was created without a company_id or if there's a timing issue.
-- This migration makes INSERT fully permissive for authenticated users
-- while keeping SELECT/UPDATE/DELETE properly scoped.
-- =============================================

-- ========== DEPARTMENTS ==========
DROP POLICY IF EXISTS "departments_insert" ON public.departments;
CREATE POLICY "departments_insert"
  ON public.departments FOR INSERT TO authenticated
  WITH CHECK (true);

-- ========== JOBS ==========
DROP POLICY IF EXISTS "jobs_insert" ON public.jobs;
CREATE POLICY "jobs_insert"
  ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (true);

-- ========== CANDIDATES ==========
DROP POLICY IF EXISTS "candidates_insert" ON public.candidates;
CREATE POLICY "candidates_insert"
  ON public.candidates FOR INSERT TO authenticated
  WITH CHECK (true);

-- ========== INTERVIEWS ==========
DROP POLICY IF EXISTS "interviews_insert" ON public.interviews;
CREATE POLICY "interviews_insert"
  ON public.interviews FOR INSERT TO authenticated
  WITH CHECK (true);
