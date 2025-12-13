-- Step 1: Add partner_profile_id column to support multiple partner profiles per user
-- NULL for personal profiles, UUID for partner profiles (allows multiple)
ALTER TABLE public.user_profiles 
ADD COLUMN partner_profile_id uuid DEFAULT NULL;

-- Step 2: Add partner profile name for display purposes  
ALTER TABLE public.user_profiles
ADD COLUMN partner_profile_name text DEFAULT NULL;

-- Step 3: Set partner_profile_id for existing partner profiles
UPDATE public.user_profiles 
SET partner_profile_id = gen_random_uuid(),
    partner_profile_name = COALESCE(profile_data->>'partnerName', 'Partner')
WHERE profile_type = 'partner' AND partner_profile_id IS NULL;

-- Step 4: Drop the old unique constraint and create a new one
-- The old constraint was (user_id, profile_type) which only allowed 1 partner profile
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_profile_type_key;

-- Create new unique constraint that allows multiple partner profiles
CREATE UNIQUE INDEX user_profiles_unique_personal ON public.user_profiles (user_id) 
WHERE profile_type = 'your';

CREATE UNIQUE INDEX user_profiles_unique_partner ON public.user_profiles (user_id, partner_profile_id) 
WHERE profile_type = 'partner';

-- Step 5: Create function to get partner profile limit based on subscription tier
CREATE OR REPLACE FUNCTION public.get_partner_profile_limit(user_id_input uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier text;
  has_override boolean;
BEGIN
  -- Check for account override first
  SELECT unlimited_messages INTO has_override
  FROM public.account_overrides ao
  JOIN auth.users u ON u.email = ao.email
  WHERE u.id = user_id_input
  LIMIT 1;
  
  IF has_override = true THEN
    RETURN 9999; -- Unlimited for overrides
  END IF;

  -- Get subscription tier
  SELECT subscription_tier INTO tier
  FROM public.subscribers
  WHERE subscribers.user_id = user_id_input
    AND subscribed = true
  LIMIT 1;
  
  -- Return limit based on tier (matches pricingPlans.ts)
  RETURN CASE tier
    WHEN 'unlimited' THEN 9999
    WHEN 'vibe' THEN 6
    WHEN 'glow' THEN 2
    ELSE 1 -- freemium/begin
  END;
END;
$$;

-- Step 6: Create function to count current partner profiles
CREATE OR REPLACE FUNCTION public.get_partner_profile_count(user_id_input uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.user_profiles
  WHERE user_id = user_id_input 
    AND profile_type = 'partner';
$$;

-- Step 7: Create trigger function to enforce limit on INSERT
CREATE OR REPLACE FUNCTION public.check_partner_profile_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  tier_limit integer;
BEGIN
  -- Only check for partner profiles
  IF NEW.profile_type != 'partner' THEN
    RETURN NEW;
  END IF;
  
  -- Get current count and limit
  current_count := public.get_partner_profile_count(NEW.user_id);
  tier_limit := public.get_partner_profile_limit(NEW.user_id);
  
  -- Block if at limit (INSERT only, not UPDATE)
  IF TG_OP = 'INSERT' AND current_count >= tier_limit THEN
    RAISE EXCEPTION 'Partner profile limit reached. Current: %, Limit: %. Upgrade your plan for more profiles.', current_count, tier_limit;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 8: Create trigger on user_profiles table
DROP TRIGGER IF EXISTS enforce_partner_profile_limit ON public.user_profiles;
CREATE TRIGGER enforce_partner_profile_limit
  BEFORE INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_partner_profile_limit();

-- Step 9: Update the upsert function to support multiple partner profiles
CREATE OR REPLACE FUNCTION public.upsert_user_profile_patch(
  p_profile_type text,
  p_patch jsonb,
  p_partner_profile_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    SELECT profile_data, demographics_data
      INTO v_existing_profile, v_existing_demo
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

  -- Upsert row (different conflict handling for partner vs personal)
  IF v_db_type = 'partner' THEN
    INSERT INTO public.user_profiles (user_id, profile_type, profile_data, demographics_data, partner_profile_id, partner_profile_name)
    VALUES (v_uid, v_db_type, v_profile_out, v_demo_out, v_partner_id, coalesce(v_profile_out->>'partnerName', 'Partner'))
    ON CONFLICT (user_id, partner_profile_id) WHERE profile_type = 'partner'
    DO UPDATE SET
      profile_data = EXCLUDED.profile_data,
      demographics_data = EXCLUDED.demographics_data,
      partner_profile_name = EXCLUDED.partner_profile_name,
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

  -- Return merged view including partner_profile_id
  RETURN coalesce(v_row.profile_data, '{}'::jsonb) 
    || coalesce(v_row.demographics_data, '{}'::jsonb)
    || jsonb_build_object('partner_profile_id', v_row.partner_profile_id);
END;
$$;