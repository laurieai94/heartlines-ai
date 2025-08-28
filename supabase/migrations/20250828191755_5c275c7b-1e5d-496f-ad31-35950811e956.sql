
-- 1) Ensure upsert target is unique and stable
create unique index if not exists user_profiles_user_id_profile_type_key
  on public.user_profiles (user_id, profile_type);

-- 2) RPC to patch-merge profile data safely.
-- This function:
-- - Accepts a profile type ('personal' or 'partner' or 'your')
-- - Strips empty-string values from the patch (but keeps arrays, even if empty)
-- - Merges the patch with the existing (profile_data || demographics_data) so we don’t lose earlier answers
-- - Writes the merged doc into BOTH profile_data and demographics_data
-- - Returns the merged doc
create or replace function public.upsert_user_profile_patch(p_profile_type text, p_patch jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
  v_profile_type text;
  v_existing jsonb := '{}'::jsonb;
  v_patch_clean jsonb := '{}'::jsonb;
  v_merged jsonb := '{}'::jsonb;
begin
  -- Ensure the caller is signed in
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'Must be signed in';
  end if;

  -- Normalize profile type to the values we store in DB
  v_profile_type := case lower(p_profile_type)
    when 'personal' then 'your'
    when 'your' then 'your'
    when 'partner' then 'partner'
    else raise exception 'Invalid profile type: %', p_profile_type
  end;

  -- Fetch existing data and merge both columns (personal reads both today)
  select coalesce(profile_data, '{}'::jsonb) || coalesce(demographics_data, '{}'::jsonb)
    into v_existing
  from public.user_profiles
  where user_id = v_uid
    and profile_type = v_profile_type
  limit 1;

  -- Clean the patch:
  -- - drop nulls
  -- - drop empty strings ("") so default blanks don't wipe real answers
  -- - KEEP arrays as-is, including empty arrays, so deselection works
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    into v_patch_clean
  from jsonb_each(coalesce(p_patch, '{}'::jsonb)) as t(k, v)
  where v is not null
    and not (jsonb_typeof(v) = 'string' and v::text = '""');

  -- Shallow merge is sufficient because our schema is flat
  v_merged := coalesce(v_existing, '{}'::jsonb) || v_patch_clean;

  -- Upsert to both columns for compatibility
  insert into public.user_profiles (user_id, profile_type, profile_data, demographics_data, updated_at)
  values (v_uid, v_profile_type, v_merged, v_merged, now())
  on conflict (user_id, profile_type)
  do update set
    profile_data = excluded.profile_data,
    demographics_data = excluded.demographics_data,
    updated_at = now()
  returning demographics_data into v_merged;

  return v_merged;
end;
$$;

-- Optional: allow execution for authenticated users
grant execute on function public.upsert_user_profile_patch(text, jsonb) to authenticated;
