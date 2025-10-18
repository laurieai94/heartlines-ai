-- Clean up orphaned records first
DELETE FROM public.user_profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.onboarding_status 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.chat_conversations 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.conversation_topics 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.conversations 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_reminders 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_message_usage 
WHERE user_id NOT IN (SELECT id FROM auth.users);

DELETE FROM public.user_token_usage 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Drop existing foreign key constraints if they exist
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE public.onboarding_status DROP CONSTRAINT IF EXISTS onboarding_status_user_id_fkey;
ALTER TABLE public.chat_conversations DROP CONSTRAINT IF EXISTS chat_conversations_user_id_fkey;
ALTER TABLE public.conversation_topics DROP CONSTRAINT IF EXISTS conversation_topics_user_id_fkey;
ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_user_id_fkey;
ALTER TABLE public.user_reminders DROP CONSTRAINT IF EXISTS user_reminders_user_id_fkey;
ALTER TABLE public.user_message_usage DROP CONSTRAINT IF EXISTS user_message_usage_user_id_fkey;
ALTER TABLE public.user_token_usage DROP CONSTRAINT IF EXISTS user_token_usage_user_id_fkey;

-- Add CASCADE delete constraints
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.onboarding_status 
ADD CONSTRAINT onboarding_status_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.chat_conversations 
ADD CONSTRAINT chat_conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.conversation_topics 
ADD CONSTRAINT conversation_topics_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_reminders 
ADD CONSTRAINT user_reminders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_message_usage 
ADD CONSTRAINT user_message_usage_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_token_usage 
ADD CONSTRAINT user_token_usage_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add storage cleanup trigger (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_deleted_cleanup_storage ON auth.users;
CREATE TRIGGER on_auth_user_deleted_cleanup_storage
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_user_storage();