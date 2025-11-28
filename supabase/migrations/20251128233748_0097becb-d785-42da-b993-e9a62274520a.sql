-- Create table to track when cache alerts were last sent (prevents spam)
CREATE TABLE public.cache_alert_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text UNIQUE NOT NULL,
  last_sent_at timestamp with time zone,
  last_value numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cache_alert_state ENABLE ROW LEVEL SECURITY;

-- Service role can manage alert state
CREATE POLICY "Service role can manage alert state"
  ON public.cache_alert_state
  FOR ALL
  USING (auth.role() = 'service_role');

-- Seed initial row for critical cache hit rate alerts
INSERT INTO public.cache_alert_state (alert_type) 
VALUES ('critical_cache_hit_rate');