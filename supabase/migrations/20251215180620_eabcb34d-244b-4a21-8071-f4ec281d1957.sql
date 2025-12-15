-- Drop the UUID overload of upsert_user_profile_patch to resolve ambiguity
-- Keep only the text version (with 30-second grace period) and the 2-parameter version
DROP FUNCTION IF EXISTS public.upsert_user_profile_patch(text, jsonb, uuid);