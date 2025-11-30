-- Create api_request_metrics table for tracking API reliability
CREATE TABLE public.api_request_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  model TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  success BOOLEAN NOT NULL,
  error_type TEXT,
  error_code INTEGER,
  input_tokens INTEGER,
  output_tokens INTEGER
);

-- Enable RLS
ALTER TABLE public.api_request_metrics ENABLE ROW LEVEL SECURITY;

-- Service role can insert metrics from edge function
CREATE POLICY "Service role can insert metrics"
ON public.api_request_metrics
FOR INSERT
TO service_role
WITH CHECK (true);

-- Admins can view all metrics for monitoring
CREATE POLICY "Admins can view all metrics"
ON public.api_request_metrics
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

-- Create daily health summary view
CREATE VIEW public.daily_api_health_summary AS
SELECT 
  DATE(created_at) as date,
  model,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE success = true) as successful_requests,
  ROUND((100.0 * COUNT(*) FILTER (WHERE success = true) / COUNT(*))::numeric, 2) as success_rate_percent,
  ROUND(AVG(response_time_ms)::numeric, 0) as avg_response_time_ms,
  ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time_ms)::numeric, 0) as p50_response_time_ms,
  ROUND(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms)::numeric, 0) as p95_response_time_ms,
  ROUND(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms)::numeric, 0) as p99_response_time_ms,
  ROUND(AVG(retry_count)::numeric, 2) as avg_retries,
  SUM(retry_count) as total_retries,
  COUNT(*) FILTER (WHERE retry_count > 0) as requests_with_retries,
  COUNT(*) FILTER (WHERE error_type = 'rate_limit') as rate_limit_errors,
  COUNT(*) FILTER (WHERE error_type = 'timeout') as timeout_errors,
  COUNT(*) FILTER (WHERE error_type = 'overload') as overload_errors,
  COUNT(*) FILTER (WHERE error_type = 'auth') as auth_errors
FROM public.api_request_metrics
GROUP BY DATE(created_at), model
ORDER BY date DESC, model;

-- Create indexes for better query performance
CREATE INDEX idx_api_request_metrics_created_at ON public.api_request_metrics(created_at);
CREATE INDEX idx_api_request_metrics_user_id ON public.api_request_metrics(user_id);
CREATE INDEX idx_api_request_metrics_success ON public.api_request_metrics(success);