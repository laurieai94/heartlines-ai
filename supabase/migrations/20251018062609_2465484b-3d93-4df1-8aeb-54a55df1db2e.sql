-- Clean up orphaned records first (users that no longer exist in auth.users)
DELETE FROM public.conversation_topics 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_reminders 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_message_usage 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_token_usage 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.chat_conversations 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.conversations 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.onboarding_status 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.subscribers 
WHERE user_id IS NOT NULL 
  AND user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.crisis_logs 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_roles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add CASCADE DELETE to all user-related tables
ALTER TABLE public.conversation_topics 
DROP CONSTRAINT IF EXISTS conversation_topics_user_id_fkey,
ADD CONSTRAINT conversation_topics_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_reminders 
DROP CONSTRAINT IF EXISTS user_reminders_user_id_fkey,
ADD CONSTRAINT user_reminders_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_message_usage 
DROP CONSTRAINT IF EXISTS user_message_usage_user_id_fkey,
ADD CONSTRAINT user_message_usage_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_token_usage 
DROP CONSTRAINT IF EXISTS user_token_usage_user_id_fkey,
ADD CONSTRAINT user_token_usage_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.chat_conversations 
DROP CONSTRAINT IF EXISTS chat_conversations_user_id_fkey,
ADD CONSTRAINT chat_conversations_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.conversations 
DROP CONSTRAINT IF EXISTS conversations_user_id_fkey,
ADD CONSTRAINT conversations_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey,
ADD CONSTRAINT user_profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.onboarding_status 
DROP CONSTRAINT IF EXISTS onboarding_status_user_id_fkey,
ADD CONSTRAINT onboarding_status_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.subscribers 
DROP CONSTRAINT IF EXISTS subscribers_user_id_fkey,
ADD CONSTRAINT subscribers_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.crisis_logs 
DROP CONSTRAINT IF EXISTS crisis_logs_user_id_fkey,
ADD CONSTRAINT crisis_logs_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey,
ADD CONSTRAINT user_roles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Create function to clean up user storage when deleted
CREATE OR REPLACE FUNCTION public.cleanup_user_storage()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete all objects in avatars bucket for this user
  DELETE FROM storage.objects 
  WHERE bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = OLD.id::text;
  
  RETURN OLD;
END;
$$;

-- Create trigger to clean up storage on user deletion
DROP TRIGGER IF EXISTS cleanup_user_storage_trigger ON auth.users;
CREATE TRIGGER cleanup_user_storage_trigger
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_user_storage();