-- Create cache_metrics table to track prompt caching performance
CREATE TABLE IF NOT EXISTS public.cache_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  model text NOT NULL,
  cache_creation_tokens integer NOT NULL DEFAULT 0,
  cache_read_tokens integer NOT NULL DEFAULT 0,
  total_input_tokens integer NOT NULL DEFAULT 0,
  cache_hit_rate numeric GENERATED ALWAYS AS (
    CASE 
      WHEN total_input_tokens > 0 
      THEN (cache_read_tokens::numeric / total_input_tokens::numeric * 100)
      ELSE 0
    END
  ) STORED,
  estimated_cost_savings numeric NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.cache_metrics ENABLE ROW LEVEL SECURITY;

-- Admin can view all cache metrics
CREATE POLICY "Admins can view all cache metrics"
  ON public.cache_metrics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Service role can insert cache metrics
CREATE POLICY "Service role can insert cache metrics"
  ON public.cache_metrics
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Create index for efficient querying by date
CREATE INDEX idx_cache_metrics_created_at ON public.cache_metrics(created_at DESC);
CREATE INDEX idx_cache_metrics_user_id ON public.cache_metrics(user_id);

-- Create view for daily cache statistics
CREATE OR REPLACE VIEW public.daily_cache_summary AS
SELECT 
  DATE(created_at) as date,
  model,
  COUNT(*) as request_count,
  SUM(cache_creation_tokens) as total_cache_creation_tokens,
  SUM(cache_read_tokens) as total_cache_read_tokens,
  SUM(total_input_tokens) as total_input_tokens,
  ROUND(
    CASE 
      WHEN SUM(total_input_tokens) > 0 
      THEN (SUM(cache_read_tokens)::numeric / SUM(total_input_tokens)::numeric * 100)
      ELSE 0
    END, 2
  ) as cache_hit_rate_percent,
  SUM(estimated_cost_savings) as total_cost_savings
FROM public.cache_metrics
GROUP BY DATE(created_at), model
ORDER BY date DESC, model;