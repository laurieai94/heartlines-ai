-- Create launch_limits configuration table
CREATE TABLE public.launch_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  max_daily_ai_spend numeric NOT NULL DEFAULT 50.00,
  max_concurrent_users integer NOT NULL DEFAULT 500,
  waitlist_active boolean NOT NULL DEFAULT false,
  waitlist_message text DEFAULT 'We''re at capacity right now! Join the waitlist and we''ll email you when there''s space.',
  auto_throttle_enabled boolean NOT NULL DEFAULT true,
  spend_check_window_hours integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.launch_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can manage launch limits
CREATE POLICY "Service role can manage launch limits"
  ON public.launch_limits FOR ALL
  USING (auth.role() = 'service_role');

-- Public can read waitlist status (for UI)
CREATE POLICY "Anyone can read waitlist status"
  ON public.launch_limits FOR SELECT
  USING (true);

-- Insert default configuration
INSERT INTO public.launch_limits (max_daily_ai_spend, max_concurrent_users, waitlist_active, auto_throttle_enabled)
VALUES (50.00, 500, false, true);

-- Create view for daily AI spend tracking
CREATE OR REPLACE VIEW public.daily_ai_spend_summary AS
SELECT 
  date_trunc('day', created_at)::date as spend_date,
  SUM(estimated_cost) as total_cost,
  COUNT(*) as request_count,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_token_usage
WHERE created_at >= CURRENT_DATE
GROUP BY date_trunc('day', created_at)::date;

-- Create view for hourly AI spend (for velocity calculation)
CREATE OR REPLACE VIEW public.hourly_ai_spend AS
SELECT 
  date_trunc('hour', created_at) as hour,
  SUM(estimated_cost) as hourly_cost,
  COUNT(*) as request_count
FROM public.user_token_usage
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY date_trunc('hour', created_at)
ORDER BY hour DESC;

-- Update waitlist table to add priority code support
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS priority_code text UNIQUE,
ADD COLUMN IF NOT EXISTS priority_expires_at timestamp with time zone;

-- Create function to generate priority codes
CREATE OR REPLACE FUNCTION public.generate_priority_code()
RETURNS text
LANGUAGE sql
AS $$
  SELECT encode(gen_random_bytes(8), 'hex');
$$;

-- Enhanced check_signup_cap function that also checks AI spend
CREATE OR REPLACE FUNCTION public.check_signup_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_count integer;
  max_allowed integer;
  cap_enabled boolean;
  waitlist_is_active boolean;
  waitlist_msg text;
  today_spend numeric;
  max_spend numeric;
  auto_throttle boolean;
BEGIN
  -- Check if user has a valid priority code
  IF NEW.raw_user_meta_data->>'priority_code' IS NOT NULL THEN
    -- Verify the priority code exists and hasn't expired
    IF EXISTS (
      SELECT 1 FROM public.waitlist 
      WHERE priority_code = NEW.raw_user_meta_data->>'priority_code'
      AND (priority_expires_at IS NULL OR priority_expires_at > NOW())
    ) THEN
      -- Valid priority code, allow signup
      RETURN NEW;
    END IF;
  END IF;

  -- Get launch limits configuration
  SELECT max_concurrent_users, waitlist_active, waitlist_message, max_daily_ai_spend, auto_throttle_enabled
  INTO max_allowed, waitlist_is_active, waitlist_msg, max_spend, auto_throttle
  FROM public.launch_limits
  LIMIT 1;
  
  -- If waitlist is explicitly active, block signup
  IF waitlist_is_active THEN
    RAISE EXCEPTION 'WAITLIST_ACTIVE: %', COALESCE(waitlist_msg, 'We''re at capacity. Join the waitlist!');
  END IF;
  
  -- Get current signup cap settings (legacy check)
  SELECT max_users, is_enabled 
  INTO max_allowed, cap_enabled
  FROM public.signup_cap
  LIMIT 1;
  
  -- If cap is disabled, check AI spend throttle
  IF NOT cap_enabled AND auto_throttle THEN
    -- Get today's AI spend
    SELECT COALESCE(SUM(estimated_cost), 0) INTO today_spend
    FROM public.user_token_usage
    WHERE created_at >= CURRENT_DATE;
    
    -- If spend exceeds threshold, activate waitlist
    IF today_spend >= max_spend THEN
      -- Auto-activate waitlist
      UPDATE public.launch_limits SET waitlist_active = true, updated_at = now();
      RAISE EXCEPTION 'WAITLIST_ACTIVE: We''re experiencing high demand! Join the waitlist and we''ll email you soon.';
    END IF;
    
    RETURN NEW;
  END IF;
  
  -- Count existing users
  SELECT COUNT(*) INTO current_count FROM auth.users;
  
  -- Check if we've hit the cap
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'WAITLIST_ACTIVE: %', COALESCE(waitlist_msg, 'We''re at capacity. Join the waitlist!');
  END IF;
  
  RETURN NEW;
END;
$$;