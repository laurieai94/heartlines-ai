-- Drop legacy unique constraint that blocks multiple partner profiles
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS uq_user_profiles_user_type;