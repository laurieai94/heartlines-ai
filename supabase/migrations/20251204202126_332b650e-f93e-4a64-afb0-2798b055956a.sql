-- Fix the view to use SECURITY INVOKER (default, safer)
DROP VIEW IF EXISTS public.kai_opener_analytics;

CREATE VIEW public.kai_opener_analytics 
WITH (security_invoker = true) AS
SELECT 
  opener_text,
  opener_category,
  COUNT(*) as usage_count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM public.kai_opener_history), 0) * 100, 2) as usage_percent,
  MAX(created_at) as last_used
FROM public.kai_opener_history
GROUP BY opener_text, opener_category
ORDER BY usage_count DESC;