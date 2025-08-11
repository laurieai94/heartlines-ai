-- Fix user_profiles table to allow both personal and partner profiles per user
-- Drop the existing unique constraint on user_id only
DROP INDEX IF EXISTS user_profiles_user_id_key;

-- Create a composite unique constraint on user_id and profile_type
-- This allows one profile per type per user (both 'personal' and 'partner')
CREATE UNIQUE INDEX user_profiles_user_id_profile_type_key 
ON user_profiles(user_id, profile_type);