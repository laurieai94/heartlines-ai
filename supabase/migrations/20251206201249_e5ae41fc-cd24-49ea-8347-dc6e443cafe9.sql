-- Insert default alert states for debouncing
INSERT INTO public.cache_alert_state (alert_type, last_sent_at, last_value)
VALUES 
  ('api_error_credit_exhausted', NULL, NULL),
  ('api_error_rate_limit', NULL, NULL),
  ('api_error_api_error', NULL, NULL),
  ('api_error_consecutive_failures', NULL, NULL),
  ('api_error_crisis_handoff', NULL, NULL)
ON CONFLICT (alert_type) DO NOTHING;

-- Enable pg_cron and pg_net for scheduled health checks
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;