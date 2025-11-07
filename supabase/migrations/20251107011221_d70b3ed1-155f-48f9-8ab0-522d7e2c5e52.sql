-- Add CASCADE delete constraint to subscribers table
ALTER TABLE public.subscribers DROP CONSTRAINT IF EXISTS subscribers_user_id_fkey;
ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add CASCADE delete constraint to crisis_logs table
ALTER TABLE public.crisis_logs DROP CONSTRAINT IF EXISTS crisis_logs_user_id_fkey;
ALTER TABLE public.crisis_logs 
ADD CONSTRAINT crisis_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enhance storage cleanup function to include email bucket
CREATE OR REPLACE FUNCTION public.cleanup_user_storage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Delete all objects in avatars bucket for this user
  DELETE FROM storage.objects 
  WHERE bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] = OLD.id::text;
  
  -- Delete all objects in email bucket for this user
  DELETE FROM storage.objects 
  WHERE bucket_id = 'email' 
    AND (storage.foldername(name))[1] = OLD.id::text;
  
  RETURN OLD;
END;
$$;

-- Ensure trigger exists and is configured correctly
DROP TRIGGER IF EXISTS on_auth_user_deleted_cleanup_storage ON auth.users;
CREATE TRIGGER on_auth_user_deleted_cleanup_storage
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_user_storage();