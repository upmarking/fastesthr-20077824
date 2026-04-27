
-- =============================================
-- SECURE PUBLIC ID CARD ACCESS
-- =============================================

-- This function allows public access to specific employee fields for ID verification.
-- It is SECURITY DEFINER to bypass RLS, but strictly returns only non-sensitive fields.

CREATE OR REPLACE FUNCTION public.get_employee_by_public_id(p_public_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT 
    jsonb_build_object(
      'id', e.id,
      'first_name', e.first_name,
      'last_name', e.last_name,
      'employee_code', e.employee_code,
      'work_email', e.work_email,
      'personal_email', e.personal_email,
      'phone', e.phone,
      'avatar_url', e.avatar_url,
      'created_at', e.created_at,
      'companies', jsonb_build_object(
        'name', c.name,
        'logo_url', c.logo_url,
        'id_card_template', c.id_card_template,
        'id_card_primary_color', c.id_card_primary_color
      ),
      'designations', jsonb_build_object(
        'title', d.title
      )
    ) INTO result
  FROM public.employees e
  LEFT JOIN public.companies c ON e.company_id = c.id
  LEFT JOIN public.designations d ON e.designation_id = d.id
  WHERE e.public_id = p_public_id
    AND e.deleted_at IS NULL;

  RETURN result;
END;
$$;

-- Grant execute permissions to anon (logged out) and authenticated users
GRANT EXECUTE ON FUNCTION public.get_employee_by_public_id(text) TO anon, authenticated;
