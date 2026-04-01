-- Update handle_new_user to set trial dates and license limits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_company_id UUID;
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
    INSERT INTO public.profiles (id, full_name, platform_role, company_id, manager_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE((NEW.raw_user_meta_data->>'platform_role')::platform_role, 'user'),
      NULLIF(NEW.raw_user_meta_data->>'company_id', '')::UUID,
      NULLIF(NEW.raw_user_meta_data->>'manager_id', '')::UUID
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce license limits
CREATE OR REPLACE FUNCTION public.check_employee_license_limit()
RETURNS TRIGGER AS $$
DECLARE
  v_license_limit INTEGER;
  v_active_count INTEGER;
BEGIN
  -- Only check if we are inserting an active employee or updating status to active
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') OR 
     (TG_OP = 'UPDATE' AND NEW.status = 'active' AND OLD.status != 'active') THEN
     
    -- Get the company's license limit
    SELECT license_limit INTO v_license_limit
    FROM public.companies
    WHERE id = NEW.company_id;

    -- If there is a limit set
    IF v_license_limit IS NOT NULL THEN
      -- Count currently active employees (excluding the one being updated since it's an UPDATE)
      SELECT COUNT(*) INTO v_active_count
      FROM public.employees
      WHERE company_id = NEW.company_id
        AND status = 'active'
        AND deleted_at IS NULL
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

      IF v_active_count >= v_license_limit THEN
        RAISE EXCEPTION 'License limit reached. Cannot add more active employees (%/% seats used).', v_active_count, v_license_limit;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_license_limit_trigger ON public.employees;

CREATE TRIGGER enforce_license_limit_trigger
  BEFORE INSERT OR UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.check_employee_license_limit();
