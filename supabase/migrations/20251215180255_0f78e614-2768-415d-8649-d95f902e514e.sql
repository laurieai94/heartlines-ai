-- Update the grace period from 3 minutes to 30 seconds
CREATE OR REPLACE FUNCTION public.upsert_user_profile_patch(
  p_profile_type text,
  p_patch jsonb,
  p_partner_profile_id text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_existing_data jsonb;
  v_merged_data jsonb;
  v_profile_id uuid;
  v_existing_name text;
  v_new_name text;
  v_locked_at timestamp with time zone;
  v_grace_period interval := interval '30 seconds';
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Handle partner profile limit check
  IF p_profile_type = 'partner' AND p_partner_profile_id IS NOT NULL THEN
    -- Check if this is a new profile (not existing)
    IF NOT EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = v_user_id 
        AND profile_type = 'partner' 
        AND partner_profile_id = p_partner_profile_id
    ) THEN
      -- Check limit
      IF get_partner_profile_count(v_user_id) >= get_partner_profile_limit(v_user_id) THEN
        RAISE EXCEPTION 'Partner profile limit reached for your subscription tier';
      END IF;
    END IF;
  END IF;

  -- For partner profiles, check name lock before proceeding
  IF p_profile_type = 'partner' AND p_partner_profile_id IS NOT NULL THEN
    SELECT partner_name_locked_at, partner_profile_name 
    INTO v_locked_at, v_existing_name
    FROM user_profiles 
    WHERE user_id = v_user_id 
      AND profile_type = 'partner' 
      AND partner_profile_id = p_partner_profile_id;
    
    v_new_name := p_patch->>'partnerName';
    
    -- If name is being changed and lock has expired, reject the change
    IF v_new_name IS NOT NULL 
       AND v_existing_name IS NOT NULL 
       AND v_new_name IS DISTINCT FROM v_existing_name
       AND v_locked_at IS NOT NULL 
       AND v_locked_at + v_grace_period < now() THEN
      RAISE EXCEPTION 'Partner name is locked and cannot be changed';
    END IF;
  END IF;

  -- Get existing data
  IF p_profile_type = 'partner' AND p_partner_profile_id IS NOT NULL THEN
    SELECT id, profile_data INTO v_profile_id, v_existing_data
    FROM user_profiles
    WHERE user_id = v_user_id 
      AND profile_type = p_profile_type
      AND partner_profile_id = p_partner_profile_id;
  ELSE
    SELECT id, profile_data INTO v_profile_id, v_existing_data
    FROM user_profiles
    WHERE user_id = v_user_id AND profile_type = p_profile_type;
  END IF;

  -- Merge patch with existing data (patch takes precedence)
  v_merged_data := COALESCE(v_existing_data, '{}'::jsonb) || p_patch;

  IF v_profile_id IS NOT NULL THEN
    -- Update existing profile
    IF p_profile_type = 'partner' AND p_partner_profile_id IS NOT NULL THEN
      UPDATE user_profiles
      SET profile_data = v_merged_data,
          partner_profile_name = COALESCE(p_patch->>'partnerName', partner_profile_name),
          updated_at = now()
      WHERE id = v_profile_id;
    ELSE
      UPDATE user_profiles
      SET profile_data = v_merged_data,
          updated_at = now()
      WHERE id = v_profile_id;
    END IF;
  ELSE
    -- Insert new profile
    IF p_profile_type = 'partner' THEN
      INSERT INTO user_profiles (user_id, profile_type, profile_data, partner_profile_id, partner_profile_name, partner_name_locked_at)
      VALUES (v_user_id, p_profile_type, v_merged_data, p_partner_profile_id, COALESCE(p_patch->>'partnerName', 'Partner'), now());
    ELSE
      INSERT INTO user_profiles (user_id, profile_type, profile_data)
      VALUES (v_user_id, p_profile_type, v_merged_data);
    END IF;
  END IF;

  RETURN v_merged_data;
END;
$$;