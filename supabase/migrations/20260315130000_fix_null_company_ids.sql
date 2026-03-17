-- =============================================
-- ONE-TIME FIX: Assign default company to orphaned profiles
-- Any profile that has company_id = NULL will be assigned
-- to a default company to prevent RLS/app errors.
-- =============================================

DO $$
DECLARE
    default_company_id UUID;
    v_profile RECORD;
BEGIN
    -- 1. Check if there are any profiles with NULL company_id
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE company_id IS NULL) THEN
        RETURN;
    END IF;

    -- 2. Get or create a default company
    SELECT id INTO default_company_id FROM public.companies LIMIT 1;
    
    IF default_company_id IS NULL THEN
        INSERT INTO public.companies (name, slug, size, industry, country, plan)
        VALUES ('FastestHR Default', 'fastesthr-default-' || floor(random() * 10000)::text, '1-10', 'Technology', 'US', 'trial')
        RETURNING id INTO default_company_id;
    END IF;

    -- 3. Update all orphaned profiles
    FOR v_profile IN SELECT id, full_name, platform_role FROM public.profiles WHERE company_id IS NULL
    LOOP
        -- Update profile
        UPDATE public.profiles 
        SET company_id = default_company_id,
            platform_role = CASE WHEN platform_role = 'user' THEN 'company_admin' ELSE platform_role END
        WHERE id = v_profile.id;
        
        -- Create/Update employee record
        IF EXISTS (SELECT 1 FROM public.employees WHERE user_id = v_profile.id) THEN
            UPDATE public.employees SET company_id = default_company_id WHERE user_id = v_profile.id;
        ELSE
            INSERT INTO public.employees (
                user_id, company_id, first_name, last_name, status
            ) VALUES (
                v_profile.id, 
                default_company_id, 
                split_part(COALESCE(v_profile.full_name, 'Unknown User'), ' ', 1),
                COALESCE(NULLIF(substring(COALESCE(v_profile.full_name, 'Unknown User') from ' (.*)'), ''), 'User'),
                'active'
            );
        END IF;
    END LOOP;
END $$;
