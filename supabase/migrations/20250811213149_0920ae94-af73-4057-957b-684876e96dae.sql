-- Fix user_profiles table to allow both personal and partner profiles per user
-- Drop the existing unique constraint on user_id only
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_key;

-- Create a composite unique constraint on user_id and profile_type
-- This allows one profile per type per user (both 'personal' and 'partner')
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_profile_type_key 
UNIQUE (user_id, profile_type);