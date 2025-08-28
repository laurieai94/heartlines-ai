
-- 1) Ensure a unique key on (user_id, profile_type) for stable upserts
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'uq_user_profiles_user_type'
  ) then
    alter table public.user_profiles
      add constraint uq_user_profiles_user_type unique (user_id, profile_type);
  end if;
end$$;

-- 2) Robust upsert RPC for user profiles that merges safely and respects RLS
create or replace function public.upsert_user_profile_patch(
  p_profile_type text,
  p_patch jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_input_type text := lower(coalesce(p_profile_type, ''));
  v_db_type text;
  v_existing_profile jsonb := '{}'::jsonb;
  v_existing_demo jsonb := '{}'::jsonb;
  v_filtered_patch jsonb := '{}'::jsonb;
  v_profile_out jsonb;
  v_demo_out jsonb;
  v_row public.user_profiles;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Map incoming profile types to DB values
  v_db_type := case v_input_type
                 when 'personal' then 'your'
                 when 'your' then 'your'
                 when 'partner' then 'partner'
                 else null
               end;

  if v_db_type is null then
    raise exception 'Invalid profile type: %', p_profile_type;
  end if;

  -- Filter patch to avoid wiping fields with empty strings, keep arrays (even empty)
  select coalesce(jsonb_object_agg(k, v), '{}'::jsonb)
    into v_filtered_patch
  from (
    select key as k, value as v
    from jsonb_each(coalesce(p_patch, '{}'::jsonb))
    where value is not null
      and not (jsonb_typeof(value) = 'string' and value::text = '""')
  ) t;

  -- Load existing (RLS ensures only own row can be seen)
  select profile_data, demographics_data
    into v_existing_profile, v_existing_demo
  from public.user_profiles
  where user_id = v_uid
    and profile_type = v_db_type
  limit 1;

  v_existing_profile := coalesce(v_existing_profile, '{}'::jsonb);
  v_existing_demo := coalesce(v_existing_demo, '{}'::jsonb);

  -- Merge semantics: arrays and scalars in patch replace existing; keys not present remain
  v_profile_out := v_existing_profile || v_filtered_patch;
  v_demo_out := v_existing_demo || v_filtered_patch;

  -- Upsert row
  insert into public.user_profiles (user_id, profile_type, profile_data, demographics_data)
  values (v_uid, v_db_type, v_profile_out, v_demo_out)
  on conflict (user_id, profile_type)
  do update set
    profile_data = excluded.profile_data,
    demographics_data = excluded.demographics_data,
    updated_at = now()
  returning * into v_row;

  -- Return a merged view for the client
  return coalesce(v_row.profile_data, '{}'::jsonb) || coalesce(v_row.demographics_data, '{}'::jsonb);
end;
$$;

-- 3) Allow authenticated users to execute this function (they’re constrained by RLS inside)
revoke all on function public.upsert_user_profile_patch(text, jsonb) from public;
grant execute on function public.upsert_user_profile_patch(text, jsonb) to authenticated;
