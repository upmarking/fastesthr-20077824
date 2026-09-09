-- PostgreSQL Migration: Fix Attendance Break and Clock Out
-- 1. Enable UPDATE RLS policy for employees on their own attendance records
-- 2. Update verify_attendance_geofence() trigger to support multi-branch, IP whitelisting, unverified fallbacks, and skip re-validation during break updates
-- 3. Update calculate_attendance_metrics() to prevent forcing 60-minute break deduction when actual break is 0

-- 1. Add UPDATE RLS policy for employees on public.attendance
DROP POLICY IF EXISTS "Employees can update own attendance" ON public.attendance;
CREATE POLICY "Employees can update own attendance"
  ON public.attendance FOR UPDATE TO authenticated
  USING (
    employee_id = public.get_user_employee_id()
    AND company_id = public.get_user_company_id()
  )
  WITH CHECK (
    employee_id = public.get_user_employee_id()
    AND company_id = public.get_user_company_id()
  );

-- 2. Resilient verify_attendance_geofence() trigger function
CREATE OR REPLACE FUNCTION public.verify_attendance_geofence()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_comp_lat double precision;
    v_comp_lon double precision;
    v_comp_rad integer;
    v_ip_whitelist text;
    v_attendance_settings jsonb;
    v_location_required boolean := true;
    v_gps jsonb;
    v_lat double precision;
    v_lon double precision;
    v_distance double precision;
    v_work_type text;
    v_location_matched boolean := false;
    v_client_ip text;
    v_is_ip_whitelisted boolean := false;
    v_gps_verified boolean := true;
    r_loc record;
BEGIN
    -- Fetch company parameters
    SELECT geofence_latitude, geofence_longitude, geofence_radius, ip_whitelist, attendance_settings
    INTO v_comp_lat, v_comp_lon, v_comp_rad, v_ip_whitelist, v_attendance_settings
    FROM public.companies
    WHERE id = NEW.company_id;

    IF v_attendance_settings IS NOT NULL AND v_attendance_settings->>'location_required' IS NOT NULL THEN
        v_location_required := (v_attendance_settings->>'location_required')::boolean;
    END IF;

    -- If location verification is disabled globally for the company, skip checks
    IF NOT v_location_required THEN
        RETURN NEW;
    END IF;

    -- Helper to check IP whitelist
    IF v_ip_whitelist IS NOT NULL AND v_ip_whitelist <> '' THEN
        v_client_ip := COALESCE(
            NEW.clock_in_ip, 
            NEW.clock_in_location->>'ip_address', 
            NEW.clock_out_location->>'ip_address'
        );
        IF v_client_ip IS NOT NULL AND position(trim(v_client_ip) IN v_ip_whitelist) > 0 THEN
            v_is_ip_whitelisted := true;
        END IF;
    END IF;

    -- ─────────────────────────────────────────────────────────────
    -- A. CLOCK-IN VALIDATION
    -- Only run on INSERT or if clock_in_location specifically changed
    -- (This ensures break updates or metadata updates never re-fail clock-in)
    -- ─────────────────────────────────────────────────────────────
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.clock_in_location IS DISTINCT FROM NEW.clock_in_location AND NEW.clock_out IS NULL)) THEN
        IF NEW.clock_in_location IS NOT NULL THEN
            v_work_type := NEW.clock_in_location->>'work_type';
            
            IF v_work_type = 'office' AND NOT v_is_ip_whitelisted THEN
                v_gps := NEW.clock_in_location->'gps';
                
                -- Check if explicitly flagged as unverified fallback
                IF v_gps IS NOT NULL AND (v_gps->>'verified' = 'false' OR v_gps->>'unverified' = 'true') THEN
                    -- Allow record insertion with unverified flag for manual regularisation
                    v_location_matched := true;
                ELSIF v_gps IS NULL OR v_gps->>'latitude' IS NULL OR v_gps->>'longitude' IS NULL THEN
                    RAISE EXCEPTION 'Office clock-in requires valid GPS location verification.';
                ELSE
                    v_lat := (v_gps->>'latitude')::double precision;
                    v_lon := (v_gps->>'longitude')::double precision;
                    v_location_matched := false;

                    -- 1. Check designated branch if employee has an assigned location_id
                    IF NEW.location_id IS NOT NULL THEN
                        SELECT latitude, longitude, radius_meters
                        INTO v_comp_lat, v_comp_lon, v_comp_rad
                        FROM public.company_locations
                        WHERE id = NEW.location_id AND is_active = true;

                        IF v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL THEN
                            v_distance := public.calculate_geofence_distance(v_lat, v_lon, v_comp_lat, v_comp_lon);
                            IF v_distance <= COALESCE(v_comp_rad, 200) THEN
                                v_location_matched := true;
                            END IF;
                        END IF;
                    END IF;

                    -- 2. Check all active company branch locations
                    IF NOT v_location_matched THEN
                        FOR r_loc IN 
                            SELECT id, latitude, longitude, radius_meters
                            FROM public.company_locations
                            WHERE company_id = NEW.company_id AND is_active = true
                        LOOP
                            v_distance := public.calculate_geofence_distance(v_lat, v_lon, r_loc.latitude, r_loc.longitude);
                            IF v_distance <= COALESCE(r_loc.radius_meters, 200) THEN
                                v_location_matched := true;
                                NEW.location_id := r_loc.id;
                                EXIT;
                            END IF;
                        END LOOP;
                    END IF;

                    -- 3. Check company default geofence
                    IF NOT v_location_matched THEN
                        SELECT geofence_latitude, geofence_longitude, geofence_radius
                        INTO v_comp_lat, v_comp_lon, v_comp_rad
                        FROM public.companies
                        WHERE id = NEW.company_id;

                        IF v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL THEN
                            v_distance := public.calculate_geofence_distance(v_lat, v_lon, v_comp_lat, v_comp_lon);
                            IF v_distance <= COALESCE(v_comp_rad, 200) THEN
                                v_location_matched := true;
                            END IF;
                        END IF;
                    END IF;

                    -- If company has defined locations/geofences and none matched
                    IF NOT v_location_matched THEN
                        IF EXISTS (SELECT 1 FROM public.company_locations WHERE company_id = NEW.company_id AND is_active = true)
                           OR (v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL) THEN
                            RAISE EXCEPTION 'Location verification failed. You are outside the allowed office boundaries.';
                        END IF;
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- ─────────────────────────────────────────────────────────────
    -- B. CLOCK-OUT VALIDATION
    -- Only run if clock_out is being set
    -- ─────────────────────────────────────────────────────────────
    IF NEW.clock_out IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.clock_out IS NULL OR OLD.clock_out_location IS DISTINCT FROM NEW.clock_out_location) THEN
        IF NEW.clock_out_location IS NOT NULL THEN
            v_work_type := NEW.clock_out_location->>'work_type';

            IF v_work_type = 'office' AND NOT v_is_ip_whitelisted THEN
                v_gps := NEW.clock_out_location->'gps';

                -- If flagged as unverified fallback (e.g. indoor / timeout / desktop without GPS), permit clock out!
                IF v_gps IS NOT NULL AND (v_gps->>'verified' = 'false' OR v_gps->>'unverified' = 'true') THEN
                    v_location_matched := true;
                ELSIF v_gps IS NULL OR v_gps->>'latitude' IS NULL OR v_gps->>'longitude' IS NULL THEN
                    -- Allow clock-out to complete without hard crash if GPS could not be obtained
                    v_location_matched := true;
                ELSE
                    v_lat := (v_gps->>'latitude')::double precision;
                    v_lon := (v_gps->>'longitude')::double precision;

                    -- Skip distance check if coordinates are 0,0 fallback
                    IF v_lat = 0 AND v_lon = 0 THEN
                        v_location_matched := true;
                    ELSE
                        v_location_matched := false;

                        -- 1. Check assigned/matched branch
                        IF NEW.location_id IS NOT NULL THEN
                            SELECT latitude, longitude, radius_meters
                            INTO v_comp_lat, v_comp_lon, v_comp_rad
                            FROM public.company_locations
                            WHERE id = NEW.location_id AND is_active = true;

                            IF v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL THEN
                                v_distance := public.calculate_geofence_distance(v_lat, v_lon, v_comp_lat, v_comp_lon);
                                IF v_distance <= COALESCE(v_comp_rad, 200) THEN
                                    v_location_matched := true;
                                END IF;
                            END IF;
                        END IF;

                        -- 2. Check all company locations
                        IF NOT v_location_matched THEN
                            FOR r_loc IN 
                                SELECT id, latitude, longitude, radius_meters
                                FROM public.company_locations
                                WHERE company_id = NEW.company_id AND is_active = true
                            LOOP
                                v_distance := public.calculate_geofence_distance(v_lat, v_lon, r_loc.latitude, r_loc.longitude);
                                IF v_distance <= COALESCE(r_loc.radius_meters, 200) THEN
                                    v_location_matched := true;
                                    EXIT;
                                END IF;
                            END LOOP;
                        END IF;

                        -- 3. Check company default geofence
                        IF NOT v_location_matched THEN
                            SELECT geofence_latitude, geofence_longitude, geofence_radius
                            INTO v_comp_lat, v_comp_lon, v_comp_rad
                            FROM public.companies
                            WHERE id = NEW.company_id;

                            IF v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL THEN
                                v_distance := public.calculate_geofence_distance(v_lat, v_lon, v_comp_lat, v_comp_lon);
                                IF v_distance <= COALESCE(v_comp_rad, 200) THEN
                                    v_location_matched := true;
                                END IF;
                            END IF;
                        END IF;

                        -- If geofences are configured and distance failed, permit clock-out with warning rather than trapping user
                        IF NOT v_location_matched THEN
                            IF EXISTS (SELECT 1 FROM public.company_locations WHERE company_id = NEW.company_id AND is_active = true)
                               OR (v_comp_lat IS NOT NULL AND v_comp_lon IS NOT NULL) THEN
                                -- Mark as unverified clock-out in jsonb
                                NEW.clock_out_location := jsonb_set(
                                    COALESCE(NEW.clock_out_location, '{}'::jsonb),
                                    '{geofence_warning}',
                                    to_jsonb('Outside office boundaries on clock-out'::text)
                                );
                            END IF;
                        END IF;
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Update calculate_attendance_metrics() to prevent forcefully overriding 0 break minutes to 60
CREATE OR REPLACE FUNCTION public.calculate_attendance_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_shift_id uuid;
    v_shift_start time;
    v_shift_end time;
    v_break_mins integer;
    v_shift_dur numeric;
    v_worked_mins numeric;
    v_ot_threshold integer := 0;
    v_payroll_settings jsonb;
    v_comp_tz text;
    v_attendance_settings jsonb;
    v_absent_limit numeric := 4.0;
    v_half_day_limit numeric := 7.0;
    v_late_grace_mins integer := 15;
    v_allow_late_login boolean := true;
    v_is_late boolean := false;
    v_is_early boolean := false;
    v_clock_in_time time;
    v_clock_out_time time;
BEGIN
    -- Only calculate if clock_in is present
    IF NEW.clock_in IS NOT NULL THEN
        -- Fetch company timezone, payroll settings, and attendance settings
        SELECT timezone, payroll_settings, attendance_settings 
        INTO v_comp_tz, v_payroll_settings, v_attendance_settings
        FROM public.companies
        WHERE id = NEW.company_id;
        
        v_comp_tz := COALESCE(v_comp_tz, 'UTC');
        
        -- Get shift assigned to the employee
        SELECT shift_id INTO v_shift_id
        FROM public.employee_shifts
        WHERE employee_id = NEW.employee_id
          AND (effective_from IS NULL OR effective_from <= NEW.date)
          AND (effective_to IS NULL OR effective_to >= NEW.date)
        ORDER BY created_at DESC
        LIMIT 1;
        
        -- Fallback to first company shift if none assigned
        IF v_shift_id IS NULL THEN
            SELECT id INTO v_shift_id
            FROM public.shifts
            WHERE company_id = NEW.company_id
            LIMIT 1;
        END IF;
        
        IF v_shift_id IS NOT NULL THEN
            SELECT start_time, end_time, break_minutes
            INTO v_shift_start, v_shift_end, v_break_mins
            FROM public.shifts
            WHERE id = v_shift_id;
        END IF;
        
        -- Default fallbacks for shift hours
        v_shift_start := COALESCE(v_shift_start, '09:00:00'::time);
        v_shift_end := COALESCE(v_shift_end, '18:00:00'::time);

        -- Parse attendance settings
        IF v_attendance_settings IS NOT NULL THEN
            v_absent_limit := COALESCE((v_attendance_settings->'brackets'->>'absent_limit_hours')::numeric, 4.0);
            v_half_day_limit := COALESCE((v_attendance_settings->'brackets'->>'half_day_limit_hours')::numeric, 7.0);
            v_late_grace_mins := COALESCE((v_attendance_settings->>'late_grace_period_mins')::integer, 15);
            v_allow_late_login := COALESCE((v_attendance_settings->>'allow_late_login')::boolean, true);
        END IF;

        -- Check if clocked in late
        v_clock_in_time := (NEW.clock_in AT TIME ZONE v_comp_tz)::time;
        IF v_clock_in_time > (v_shift_start + (v_late_grace_mins || ' minutes')::interval) THEN
            v_is_late := true;
        END IF;

        -- If performing clock-in (clock_out is NULL), enforce late login block if disallowed on initial insert
        IF NEW.clock_out IS NULL THEN
            IF TG_OP = 'INSERT' AND v_is_late AND NOT v_allow_late_login THEN
                RAISE EXCEPTION 'Late login is not allowed. Your shift starts at % and the allowed late buffer is % minutes.', 
                    to_char(v_shift_start, 'HH24:MI'), v_late_grace_mins;
            END IF;
            
            -- Only set initial status on INSERT (preserve status updates during break/metadata changes)
            IF TG_OP = 'INSERT' THEN
                IF v_is_late THEN
                    NEW.status := 'late'::public.attendance_status;
                ELSE
                    NEW.status := 'present'::public.attendance_status;
                END IF;
            END IF;
        ELSE
            -- They are clocking out (or updating a completed shift)
            -- Calculate expected shift duration
            IF v_shift_end >= v_shift_start THEN
                v_shift_dur := EXTRACT(EPOCH FROM (v_shift_end - v_shift_start)) / 3600.0;
            ELSE
                v_shift_dur := (EXTRACT(EPOCH FROM (v_shift_end - v_shift_start)) + 86400) / 3600.0;
            END IF;
            
            -- Exclude break from shift duration
            v_shift_dur := GREATEST(0.0, v_shift_dur - (COALESCE(v_break_mins, 60)::numeric / 60.0));
            
            -- Keep actual recorded break minutes; default to 0 if null
            IF NEW.break_minutes IS NULL THEN
                NEW.break_minutes := 0;
            END IF;
            
            -- Calculate actual minutes worked (subtracting recorded break_minutes)
            v_worked_mins := (EXTRACT(EPOCH FROM (NEW.clock_out - NEW.clock_in)) / 60.0) - COALESCE(NEW.break_minutes, 0);
            v_worked_mins := GREATEST(0.0, v_worked_mins);
            
            -- Set total_hours
            NEW.total_hours := ROUND((v_worked_mins / 60.0)::numeric, 2);
            
            -- Fetch overtime threshold
            IF v_payroll_settings IS NOT NULL AND v_payroll_settings->>'overtime_threshold_mins' IS NOT NULL THEN
                v_ot_threshold := (v_payroll_settings->>'overtime_threshold_mins')::integer;
            END IF;
            
            -- Calculate overtime hours
            IF v_worked_mins > ((v_shift_dur * 60.0) + v_ot_threshold) THEN
                NEW.overtime_hours := ROUND(((v_worked_mins - (v_shift_dur * 60.0)) / 60.0)::numeric, 2);
            ELSE
                NEW.overtime_hours := 0.00;
            END IF;

            -- Check if clocked out early
            v_clock_out_time := (NEW.clock_out AT TIME ZONE v_comp_tz)::time;
            IF v_clock_out_time < v_shift_end THEN
                v_is_early := true;
            END IF;

            -- Apply working hours brackets to set final status
            IF NEW.total_hours < v_absent_limit THEN
                NEW.status := 'absent'::public.attendance_status;
            ELSIF NEW.total_hours < v_half_day_limit THEN
                NEW.status := 'half_day'::public.attendance_status;
            ELSE
                -- Full day present, verify if late or early leave occurred
                IF v_is_late THEN
                    NEW.status := 'late'::public.attendance_status;
                ELSIF v_is_early THEN
                    NEW.status := 'early_leave'::public.attendance_status;
                ELSE
                    NEW.status := 'present'::public.attendance_status;
                END IF;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;
