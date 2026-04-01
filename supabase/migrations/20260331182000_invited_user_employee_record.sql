CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
  target_company_id UUID;
BEGIN
  -- If user is registering as a company admin (has company name)
  IF NEW.raw_user_meta_data->>'platform_role' = 'company_admin' AND NEW.raw_user_meta_data->>'company_name' IS NOT NULL THEN
    
    INSERT INTO public.companies (
      name, 
      slug, 
      size, 
      industry, 
      country,
      plan,
      plan_expires_at,
      license_limit
    ) VALUES (
      NEW.raw_user_meta_data->>'company_name',
      LOWER(REGEXP_REPLACE(NEW.raw_user_meta_data->>'company_name', '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(NEW.id::text, 1, 6),
      NEW.raw_user_meta_data->>'company_size',
      NEW.raw_user_meta_data->>'company_industry',
      NEW.raw_user_meta_data->>'company_country',
      'trial',
      now() + interval '14 days',
      5
    ) RETURNING id INTO new_company_id;

    -- Create profile with company_id
    INSERT INTO public.profiles (id, company_id, full_name, platform_role)
    VALUES (
      NEW.id,
      new_company_id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      'company_admin'
    );

    -- Also create an employee record for them
    INSERT INTO public.employees (
      user_id,
      company_id,
      first_name,
      last_name,
      work_email,
      employment_type,
      status
    ) VALUES (
      NEW.id,
      new_company_id,
      split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1),
      COALESCE(NULLIF(substring(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) from ' (.*)'), ''), 'Admin'),
      NEW.email,
      'full_time',
      'active'
    );

  ELSE
    -- Standard user signup (invited or standard)
    target_company_id := NULLIF(NEW.raw_user_meta_data->>'company_id', '')::UUID;

    INSERT INTO public.profiles (id, full_name, platform_role, company_id, manager_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE((NEW.raw_user_meta_data->>'platform_role')::platform_role, 'user'),
      target_company_id,
      NULLIF(NEW.raw_user_meta_data->>'manager_id', '')::UUID
    );

    -- If they belong to a company, ensure they have an employee record
    IF target_company_id IS NOT NULL THEN
      IF EXISTS (SELECT 1 FROM public.employees WHERE company_id = target_company_id AND work_email = NEW.email AND deleted_at IS NULL) THEN
        UPDATE public.employees 
        SET user_id = NEW.id 
        WHERE company_id = target_company_id 
          AND work_email = NEW.email 
          AND deleted_at IS NULL;
      ELSE
        INSERT INTO public.employees (
          user_id,
          company_id,
          first_name,
          last_name,
          work_email,
          employment_type,
          status
        ) VALUES (
          NEW.id,
          target_company_id,
          split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1),
          COALESCE(NULLIF(substring(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email) from ' (.*)'), ''), 'User'),
          NEW.email,
          'full_time',
          'active'
        );
      END IF;
    END IF;

  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Backfill existing profiles into employees if they aren't there yet
INSERT INTO public.employees (
  user_id,
  company_id,
  first_name,
  last_name,
  work_email,
  employment_type,
  status
)
SELECT 
  p.id,
  p.company_id,
  split_part(p.full_name, ' ', 1),
  COALESCE(NULLIF(substring(p.full_name from ' (.*)'), ''), 'User'),
  u.email,
  'full_time',
  'active'
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.company_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM public.employees e 
    WHERE e.company_id = p.company_id 
      AND (e.user_id = p.id OR e.work_email = u.email)
  );

-- Link any existing employees to user_id if email matches
UPDATE public.employees e
SET user_id = u.id
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE e.company_id = p.company_id
  AND e.work_email = u.email
  AND e.user_id IS NULL;
