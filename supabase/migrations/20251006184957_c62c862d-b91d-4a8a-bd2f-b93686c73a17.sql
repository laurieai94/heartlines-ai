-- Create signup cap configuration table
CREATE TABLE public.signup_cap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  max_users integer NOT NULL DEFAULT 50,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert initial cap of 50 users
INSERT INTO public.signup_cap (max_users, is_enabled) 
VALUES (50, true);

-- Enable RLS
ALTER TABLE public.signup_cap ENABLE ROW LEVEL SECURITY;

-- Only service role can manage signup cap
CREATE POLICY "Service role can manage signup cap"
  ON public.signup_cap
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to check signup cap
CREATE OR REPLACE FUNCTION public.check_signup_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  max_allowed integer;
  cap_enabled boolean;
BEGIN
  -- Get current signup cap settings
  SELECT max_users, is_enabled 
  INTO max_allowed, cap_enabled
  FROM public.signup_cap
  LIMIT 1;
  
  -- If cap is disabled, allow signup
  IF NOT cap_enabled THEN
    RETURN NEW;
  END IF;
  
  -- Count existing users
  SELECT COUNT(*) INTO current_count FROM auth.users;
  
  -- Check if we've hit the cap
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'SIGNUP_CAP_REACHED: Private preview is currently full. Please join our waitlist.'
      USING HINT = 'max_users=' || max_allowed;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to enforce cap
CREATE TRIGGER enforce_signup_cap
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_signup_cap();

-- Optional: Create waitlist table for users who want to sign up when cap is reached
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  notified boolean DEFAULT false
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to join waitlist
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own waitlist entry
CREATE POLICY "Users can view their waitlist entry"
  ON public.waitlist
  FOR SELECT
  USING (email = auth.email());