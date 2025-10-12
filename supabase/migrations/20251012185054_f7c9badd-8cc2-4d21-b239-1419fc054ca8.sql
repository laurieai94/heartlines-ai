-- Allow empty strings to be used as deletion markers in profile patches
-- This fixes the issue where clearing a field (e.g., name) doesn't persist

CREATE OR REPLACE FUNCTION public.upsert_user_profile_patch(
  p_profile_type text,
  p_patch jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

  -- Only filter out null values, but KEEP empty strings (they signal deletion)
  -- Empty arrays are also kept (valid deletions for multi-select fields)
  SELECT coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    INTO v_filtered_patch
  FROM (
    SELECT key AS k, value AS v
    FROM jsonb_each(coalesce(p_patch, '{}'::jsonb))
    WHERE value IS NOT NULL
    -- Removed the empty string filter - empty strings now overwrite existing values
  ) t;

  -- Load existing (RLS ensures only own row can be seen)
  SELECT profile_data, demographics_data
    INTO v_existing_profile, v_existing_demo
  FROM public.user_profiles
  WHERE user_id = v_uid
    AND profile_type = v_db_type
  LIMIT 1;

  v_existing_profile := coalesce(v_existing_profile, '{}'::jsonb);
  v_existing_demo := coalesce(v_existing_demo, '{}'::jsonb);

  -- Merge semantics: arrays and scalars in patch replace existing; keys not present remain
  -- Now empty strings will properly overwrite existing values
  v_profile_out := v_existing_profile || v_filtered_patch;
  v_demo_out := v_existing_demo || v_filtered_patch;

  -- Upsert row
  INSERT INTO public.user_profiles (user_id, profile_type, profile_data, demographics_data)
  VALUES (v_uid, v_db_type, v_profile_out, v_demo_out)
  ON CONFLICT (user_id, profile_type)
  DO UPDATE SET
    profile_data = EXCLUDED.profile_data,
    demographics_data = EXCLUDED.demographics_data,
    updated_at = now()
  RETURNING * INTO v_row;

  -- Return a merged view for the client
  RETURN coalesce(v_row.profile_data, '{}'::jsonb) || coalesce(v_row.demographics_data, '{}'::jsonb);
END;
$$;