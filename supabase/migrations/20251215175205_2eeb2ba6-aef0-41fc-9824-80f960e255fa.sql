-- Add column to track when partner name was first set (for 3-minute grace period)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS partner_name_locked_at timestamptz DEFAULT NULL;

-- Update the upsert_user_profile_patch function to enforce 3-minute grace period
CREATE OR REPLACE FUNCTION public.upsert_user_profile_patch(p_profile_type text, p_patch jsonb, p_partner_profile_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_input_type text := lower(coalesce(p_profile_type, ''));
  v_db_type text;
  v_existing_profile jsonb := '{}'::jsonb;
  v_existing_demo jsonb := '{}'::jsonb;
  v_filtered_patch jsonb := '{}'::jsonb;
  v_profile_out jsonb;
  v_demo_out jsonb;
  v_row public.user_profiles;
  v_partner_id uuid;
  v_existing_lock_time timestamptz;
  v_existing_name text;
  v_new_name text;
  v_grace_period interval := interval '3 minutes';
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Map incoming profile types to DB values
  v_db_type := CASE v_input_type
                 WHEN 'personal' THEN 'your'
                 WHEN 'your' THEN 'your'
                 WHEN 'partner' THEN 'partner'
                 ELSE NULL
               END;

  IF v_db_type IS NULL THEN
    RAISE EXCEPTION 'Invalid profile type: %', p_profile_type;
  END IF;

  -- Handle partner profile ID
  IF v_db_type = 'partner' THEN
    -- If no partner_profile_id provided, check if user has an existing partner profile
    IF p_partner_profile_id IS NULL THEN
      SELECT partner_profile_id INTO v_partner_id
      FROM public.user_profiles
      WHERE user_id = v_uid AND profile_type = 'partner'
      ORDER BY created_at ASC
      LIMIT 1;
      
      -- If still no partner profile, generate new ID for new profile
      IF v_partner_id IS NULL THEN
        v_partner_id := gen_random_uuid();
      END IF;
    ELSE
      v_partner_id := p_partner_profile_id;
    END IF;
  END IF;

  -- Filter out null values
  SELECT coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    INTO v_filtered_patch
  FROM (
    SELECT key AS k, value AS v
    FROM jsonb_each(coalesce(p_patch, '{}'::jsonb))
    WHERE value IS NOT NULL
  ) t;

  -- Load existing profile (different query for partner vs personal)
  IF v_db_type = 'partner' THEN
    SELECT profile_data, demographics_data, partner_name_locked_at, partner_profile_name
      INTO v_existing_profile, v_existing_demo, v_existing_lock_time, v_existing_name
    FROM public.user_profiles
    WHERE user_id = v_uid
      AND profile_type = v_db_type
      AND partner_profile_id = v_partner_id
    LIMIT 1;
  ELSE
    SELECT profile_data, demographics_data
      INTO v_existing_profile, v_existing_demo
    FROM public.user_profiles
    WHERE user_id = v_uid
      AND profile_type = v_db_type
    LIMIT 1;
  END IF;

  v_existing_profile := coalesce(v_existing_profile, '{}'::jsonb);
  v_existing_demo := coalesce(v_existing_demo, '{}'::jsonb);

  -- Merge patch with existing
  v_profile_out := v_existing_profile || v_filtered_patch;
  v_demo_out := v_existing_demo || v_filtered_patch;

  -- Handle partner name locking logic
  IF v_db_type = 'partner' THEN
    v_new_name := coalesce(v_filtered_patch->>'partnerName', v_profile_out->>'partnerName');
    
    -- Check if name is being changed and if it's locked
    IF v_existing_lock_time IS NOT NULL 
       AND v_new_name IS NOT NULL 
       AND v_new_name != '' 
       AND v_existing_name IS NOT NULL 
       AND v_existing_name != ''
       AND v_new_name != v_existing_name THEN
      -- Name exists and is being changed - check grace period
      IF now() > (v_existing_lock_time + v_grace_period) THEN
        -- Grace period expired - reject name change by keeping old name
        v_profile_out := jsonb_set(v_profile_out, '{partnerName}', to_jsonb(v_existing_name));
        v_demo_out := jsonb_set(v_demo_out, '{partnerName}', to_jsonb(v_existing_name));
        v_new_name := v_existing_name;
      END IF;
    END IF;
  END IF;

  -- Upsert row (different conflict handling for partner vs personal)
  IF v_db_type = 'partner' THEN
    INSERT INTO public.user_profiles (user_id, profile_type, profile_data, demographics_data, partner_profile_id, partner_profile_name, partner_name_locked_at)
    VALUES (
      v_uid, 
      v_db_type, 
      v_profile_out, 
      v_demo_out, 
      v_partner_id, 
      coalesce(v_new_name, 'Partner'),
      -- Set lock time on first valid name save
      CASE 
        WHEN v_existing_lock_time IS NOT NULL THEN v_existing_lock_time
        WHEN v_new_name IS NOT NULL AND v_new_name != '' AND v_new_name != 'Partner' THEN now()
        ELSE NULL
      END
    )
    ON CONFLICT (user_id, partner_profile_id) WHERE profile_type = 'partner'
    DO UPDATE SET
      profile_data = EXCLUDED.profile_data,
      demographics_data = EXCLUDED.demographics_data,
      partner_profile_name = EXCLUDED.partner_profile_name,
      partner_name_locked_at = COALESCE(user_profiles.partner_name_locked_at, EXCLUDED.partner_name_locked_at),
      updated_at = now()
    RETURNING * INTO v_row;
  ELSE
    INSERT INTO public.user_profiles (user_id, profile_type, profile_data, demographics_data)
    VALUES (v_uid, v_db_type, v_profile_out, v_demo_out)
    ON CONFLICT (user_id) WHERE profile_type = 'your'
    DO UPDATE SET
      profile_data = EXCLUDED.profile_data,
      demographics_data = EXCLUDED.demographics_data,
      updated_at = now()
    RETURNING * INTO v_row;
  END IF;

  -- Return merged view including partner_profile_id and lock time
  RETURN coalesce(v_row.profile_data, '{}'::jsonb) 
    || coalesce(v_row.demographics_data, '{}'::jsonb)
    || jsonb_build_object(
         'partner_profile_id', v_row.partner_profile_id,
         'partner_name_locked_at', v_row.partner_name_locked_at
       );
END;
$function$;