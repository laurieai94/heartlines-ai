
-- Enable RLS on existing tables that need user association (skip profiles as it's already enabled)
ALTER TABLE public.conversation_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversation_topics table (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversation_topics' 
        AND policyname = 'Users can view their own topics'
    ) THEN
        CREATE POLICY "Users can view their own topics"
        ON public.conversation_topics FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversation_topics' 
        AND policyname = 'Users can insert their own topics'
    ) THEN
        CREATE POLICY "Users can insert their own topics"
        ON public.conversation_topics FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversation_topics' 
        AND policyname = 'Users can update their own topics'
    ) THEN
        CREATE POLICY "Users can update their own topics"
        ON public.conversation_topics FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create RLS policies for chat_conversations table (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'chat_conversations' 
        AND policyname = 'Users can view their own conversations'
    ) THEN
        CREATE POLICY "Users can view their own conversations"
        ON public.chat_conversations FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'chat_conversations' 
        AND policyname = 'Users can create their own conversations'
    ) THEN
        CREATE POLICY "Users can create their own conversations"
        ON public.chat_conversations FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'chat_conversations' 
        AND policyname = 'Users can update their own conversations'
    ) THEN
        CREATE POLICY "Users can update their own conversations"
        ON public.chat_conversations FOR UPDATE
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'chat_conversations' 
        AND policyname = 'Users can delete their own conversations'
    ) THEN
        CREATE POLICY "Users can delete their own conversations"
        ON public.chat_conversations FOR DELETE
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create user_profiles table to store detailed profile information (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  profile_type TEXT NOT NULL CHECK (profile_type IN ('your', 'partner')),
  profile_data JSONB NOT NULL DEFAULT '{}',
  demographics_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user profiles"
ON public.user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own user profiles"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user profiles"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user profiles"
ON public.user_profiles FOR DELETE
USING (auth.uid() = user_id);

-- Create onboarding_status table to track user onboarding progress (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.onboarding_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  profile_completed BOOLEAN NOT NULL DEFAULT false,
  partner_profile_completed BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for onboarding_status
ALTER TABLE public.onboarding_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own onboarding status"
ON public.onboarding_status FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding status"
ON public.onboarding_status FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding status"
ON public.onboarding_status FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email));
  
  INSERT INTO public.onboarding_status (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile for new users (only if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
