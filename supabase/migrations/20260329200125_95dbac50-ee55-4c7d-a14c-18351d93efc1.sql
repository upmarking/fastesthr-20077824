
-- =====================================================
-- 1. FIX: companies anon policy exposes SMTP credentials
--    Replace broad anon SELECT with a restricted view
-- =====================================================

-- Drop the dangerous anon policy
DROP POLICY IF EXISTS "public_company_read" ON public.companies;

-- Create a safe public view for careers pages
CREATE OR REPLACE VIEW public.public_companies AS
SELECT id, name, slug, logo_url, about_company, industry, size, country, website, linkedin_url, custom_domain
FROM public.companies
WHERE is_active = true AND deleted_at IS NULL;

-- Grant anon access to the view only
GRANT SELECT ON public.public_companies TO anon;

-- =====================================================
-- 2. FIX: candidates_all policy allows cross-company access
-- =====================================================

DROP POLICY IF EXISTS "candidates_all" ON public.candidates;

-- Company staff can manage candidates in their company
CREATE POLICY "Company staff can manage candidates"
ON public.candidates
FOR ALL
TO authenticated
USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- =====================================================
-- 3. FIX: candidate_offers public read exposes all offers
-- =====================================================

DROP POLICY IF EXISTS "Enable public read via token" ON public.candidate_offers;

-- Create an RPC to fetch offer by token (secure, no broad SELECT)
CREATE OR REPLACE FUNCTION public.get_offer_by_token(p_token uuid)
RETURNS SETOF public.candidate_offers
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.candidate_offers WHERE token = p_token LIMIT 1;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_offer_by_token(uuid) TO anon, authenticated;

-- =====================================================
-- 4. FIX: jobs overly permissive ALL policy
-- =====================================================

DROP POLICY IF EXISTS "jobs_all" ON public.jobs;

CREATE POLICY "Company staff can manage jobs"
ON public.jobs
FOR ALL
TO authenticated
USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- =====================================================
-- 5. FIX: departments overly permissive ALL policy
-- =====================================================

DROP POLICY IF EXISTS "dept_all" ON public.departments;

CREATE POLICY "Company staff can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (company_id = get_user_company_id())
WITH CHECK (company_id = get_user_company_id());

-- =====================================================
-- 6. FIX: interviews overly permissive ALL policy
-- =====================================================

DROP POLICY IF EXISTS "interviews_all" ON public.interviews;

CREATE POLICY "Company staff can manage interviews"
ON public.interviews
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = interviews.candidate_id
    AND c.company_id = get_user_company_id()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.candidates c
    WHERE c.id = interviews.candidate_id
    AND c.company_id = get_user_company_id()
  )
);

-- =====================================================
-- 7. FIX: Storage bucket policies - add company scoping
-- =====================================================

-- offer_letters bucket: scope to company folder
DROP POLICY IF EXISTS "Enable read for team members" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for team members" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for team members" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for team members" ON storage.objects;

-- Scoped offer_letters read
CREATE POLICY "offer_letters_read_scoped"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'offer_letters'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

-- Scoped offer_letters insert
CREATE POLICY "offer_letters_insert_scoped"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'offer_letters'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

-- Scoped offer_letters update
CREATE POLICY "offer_letters_update_scoped"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'offer_letters'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

-- Scoped offer_letters delete
CREATE POLICY "offer_letters_delete_scoped"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'offer_letters'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

-- senddesk-documents bucket: scope to company folder
DROP POLICY IF EXISTS "Company users can read senddesk documents" ON storage.objects;
DROP POLICY IF EXISTS "Company users can upload senddesk documents" ON storage.objects;
DROP POLICY IF EXISTS "Company users can delete senddesk documents" ON storage.objects;

CREATE POLICY "senddesk_read_scoped"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'senddesk-documents'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "senddesk_insert_scoped"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'senddesk-documents'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "senddesk_delete_scoped"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'senddesk-documents'
  AND (storage.foldername(name))[1] = (SELECT company_id::text FROM public.profiles WHERE id = auth.uid())
);
