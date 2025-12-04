-- Fix Security Definer View issue by recreating views with SECURITY INVOKER
-- and proper admin role checks in WHERE clauses

-- Drop and recreate daily_cost_summary (already has admin check, just ensure SECURITY INVOKER)
DROP VIEW IF EXISTS public.daily_cost_summary;
CREATE VIEW public.daily_cost_summary
WITH (security_invoker = true)
AS
SELECT 
    date_trunc('day'::text, utu.created_at)::date AS date,
    utu.model,
    count(*) AS message_count,
    sum(utu.input_tokens) AS total_input_tokens,
    sum(utu.output_tokens) AS total_output_tokens,
    sum(utu.total_tokens) AS total_tokens,
    sum(utu.estimated_cost) AS total_cost,
    avg(utu.total_tokens) AS avg_tokens_per_message,
    avg(utu.input_tokens) AS avg_input_tokens_per_message,
    avg(utu.output_tokens) AS avg_output_tokens_per_message,
    avg(utu.estimated_cost) AS avg_cost_per_message
FROM user_token_usage utu
LEFT JOIN profiles p ON p.user_id = utu.user_id
LEFT JOIN subscribers s ON s.user_id = utu.user_id
LEFT JOIN account_overrides ao ON ao.email = s.email
WHERE public.has_role(auth.uid(), 'admin'::app_role) 
  AND (ao.unlimited_messages IS NULL OR ao.unlimited_messages = false)
GROUP BY date_trunc('day'::text, utu.created_at)::date, utu.model
ORDER BY date_trunc('day'::text, utu.created_at)::date DESC;

-- Drop and recreate daily_api_health_summary with admin check
DROP VIEW IF EXISTS public.daily_api_health_summary;
CREATE VIEW public.daily_api_health_summary
WITH (security_invoker = true)
AS
SELECT 
    date(api_request_metrics.created_at) AS date,
    api_request_metrics.model,
    count(*) AS total_requests,
    count(*) FILTER (WHERE api_request_metrics.success = true) AS successful_requests,
    round(100.0 * count(*) FILTER (WHERE api_request_metrics.success = true)::numeric / count(*)::numeric, 2) AS success_rate_percent,
    round(avg(api_request_metrics.response_time_ms), 0) AS avg_response_time_ms,
    round(percentile_cont(0.50) WITHIN GROUP (ORDER BY api_request_metrics.response_time_ms::double precision)::numeric, 0) AS p50_response_time_ms,
    round(percentile_cont(0.95) WITHIN GROUP (ORDER BY api_request_metrics.response_time_ms::double precision)::numeric, 0) AS p95_response_time_ms,
    round(percentile_cont(0.99) WITHIN GROUP (ORDER BY api_request_metrics.response_time_ms::double precision)::numeric, 0) AS p99_response_time_ms,
    round(avg(api_request_metrics.retry_count), 2) AS avg_retries,
    sum(api_request_metrics.retry_count) AS total_retries,
    count(*) FILTER (WHERE api_request_metrics.retry_count > 0) AS requests_with_retries,
    count(*) FILTER (WHERE api_request_metrics.error_type = 'rate_limit'::text) AS rate_limit_errors,
    count(*) FILTER (WHERE api_request_metrics.error_type = 'timeout'::text) AS timeout_errors,
    count(*) FILTER (WHERE api_request_metrics.error_type = 'overload'::text) AS overload_errors,
    count(*) FILTER (WHERE api_request_metrics.error_type = 'auth'::text) AS auth_errors
FROM api_request_metrics
WHERE public.has_role(auth.uid(), 'admin'::app_role)
GROUP BY date(api_request_metrics.created_at), api_request_metrics.model
ORDER BY date(api_request_metrics.created_at) DESC, api_request_metrics.model;

-- Drop and recreate daily_cache_summary with admin check
DROP VIEW IF EXISTS public.daily_cache_summary;
CREATE VIEW public.daily_cache_summary
WITH (security_invoker = true)
AS
SELECT 
    date(cache_metrics.created_at) AS date,
    cache_metrics.model,
    count(*) AS request_count,
    sum(cache_metrics.cache_creation_tokens) AS total_cache_creation_tokens,
    sum(cache_metrics.cache_read_tokens) AS total_cache_read_tokens,
    sum(cache_metrics.total_input_tokens) AS total_input_tokens,
    round(
        CASE
            WHEN sum(cache_metrics.total_input_tokens) > 0 
            THEN sum(cache_metrics.cache_read_tokens)::numeric / sum(cache_metrics.total_input_tokens)::numeric * 100::numeric
            ELSE 0::numeric
        END, 2) AS cache_hit_rate_percent,
    sum(cache_metrics.estimated_cost_savings) AS total_cost_savings
FROM cache_metrics
WHERE public.has_role(auth.uid(), 'admin'::app_role)
GROUP BY date(cache_metrics.created_at), cache_metrics.model
ORDER BY date(cache_metrics.created_at) DESC, cache_metrics.model;

-- Drop and recreate kai_opener_analytics with admin check
DROP VIEW IF EXISTS public.kai_opener_analytics;
CREATE VIEW public.kai_opener_analytics
WITH (security_invoker = true)
AS
SELECT 
    kai_opener_history.opener_text,
    kai_opener_history.opener_category,
    count(*) AS usage_count,
    round(count(*)::numeric / NULLIF((SELECT count(*) FROM kai_opener_history), 0)::numeric * 100::numeric, 2) AS usage_percent,
    max(kai_opener_history.created_at) AS last_used
FROM kai_opener_history
WHERE public.has_role(auth.uid(), 'admin'::app_role)
GROUP BY kai_opener_history.opener_text, kai_opener_history.opener_category
ORDER BY count(*) DESC;