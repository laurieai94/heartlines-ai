-- Change partner_profile_id from uuid to text for compatibility with frontend string values
ALTER TABLE public.user_profiles 
ALTER COLUMN partner_profile_id TYPE text 
USING partner_profile_id::text;