-- Add unique constraint to prevent duplicate monthly usage records
ALTER TABLE public.user_message_usage ADD CONSTRAINT unique_user_month UNIQUE (user_id, usage_month);

-- Create function to atomically increment message usage
CREATE OR REPLACE FUNCTION public.increment_message_usage(
  p_user_id UUID,
  p_usage_month DATE DEFAULT date_trunc('month', CURRENT_DATE)::date,
  p_delta INTEGER DEFAULT 1
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_message_usage (user_id, usage_month, current_month_usage, updated_at)
  VALUES (p_user_id, p_usage_month, p_delta, now())
  ON CONFLICT (user_id, usage_month)
  DO UPDATE SET 
    current_month_usage = user_message_usage.current_month_usage + p_delta,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;