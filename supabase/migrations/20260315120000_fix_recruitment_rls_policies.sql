-- =============================================
-- FIX: RLS policies for Recruitment module (comprehensive)
-- Problem: The FOR ALL policies with is_company_admin() check 
-- block INSERT operations. This migration replaces them with 
-- separate, working policies for each operation type.
-- =============================================

-- ========== DEPARTMENTS ==========
-- Drop existing policies
DROP POLICY IF EXISTS "Company members can view departments" ON public.departments;
DROP POLICY IF EXISTS "Company admins can manage departments" ON public.departments;
DROP POLICY IF EXISTS "Company admins can insert departments" ON public.departments;

-- Re-create with proper separation
CREATE POLICY "departments_select"
  ON public.departments FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id() OR public.is_super_admin());

CREATE POLICY "departments_insert"
  ON public.departments FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "departments_update"
  ON public.departments FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id());

CREATE POLICY "departments_delete"
  ON public.departments FOR DELETE TO authenticated
  USING (company_id = public.get_user_company_id() AND (public.is_company_admin() OR public.is_super_admin()));

-- ========== JOBS ==========
DROP POLICY IF EXISTS "Company members can view jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company admins can manage jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company admins can insert jobs" ON public.jobs;

CREATE POLICY "jobs_select"
  ON public.jobs FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id() OR public.is_super_admin());

CREATE POLICY "jobs_insert"
  ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "jobs_update"
  ON public.jobs FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id());

CREATE POLICY "jobs_delete"
  ON public.jobs FOR DELETE TO authenticated
  USING (company_id = public.get_user_company_id() AND (public.is_company_admin() OR public.is_super_admin()));

-- ========== CANDIDATES ==========
DROP POLICY IF EXISTS "Company members can view candidates" ON public.candidates;
DROP POLICY IF EXISTS "Company admins can manage candidates" ON public.candidates;
DROP POLICY IF EXISTS "Company admins can insert candidates" ON public.candidates;

CREATE POLICY "candidates_select"
  ON public.candidates FOR SELECT TO authenticated
  USING (company_id = public.get_user_company_id() OR public.is_super_admin());

CREATE POLICY "candidates_insert"
  ON public.candidates FOR INSERT TO authenticated
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "candidates_update"
  ON public.candidates FOR UPDATE TO authenticated
  USING (company_id = public.get_user_company_id());

CREATE POLICY "candidates_delete"
  ON public.candidates FOR DELETE TO authenticated
  USING (company_id = public.get_user_company_id() AND (public.is_company_admin() OR public.is_super_admin()));

-- ========== INTERVIEWS ==========
DROP POLICY IF EXISTS "Company members can view interviews" ON public.interviews;
DROP POLICY IF EXISTS "Company admins can manage interviews" ON public.interviews;
DROP POLICY IF EXISTS "Company admins can insert interviews" ON public.interviews;

CREATE POLICY "interviews_select"
  ON public.interviews FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.company_id = public.get_user_company_id()
  ) OR public.is_super_admin());

CREATE POLICY "interviews_insert"
  ON public.interviews FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.company_id = public.get_user_company_id()
  ));

CREATE POLICY "interviews_update"
  ON public.interviews FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.company_id = public.get_user_company_id()
  ));

CREATE POLICY "interviews_delete"
  ON public.interviews FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.candidates c WHERE c.id = candidate_id AND c.company_id = public.get_user_company_id()
  ) AND (public.is_company_admin() OR public.is_super_admin()));
