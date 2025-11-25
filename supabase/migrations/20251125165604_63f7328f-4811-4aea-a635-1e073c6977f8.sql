-- Fix critical security issue: Remove direct auth.users exposure from analytics views
-- Drop existing views that expose auth.users
DROP VIEW IF EXISTS public.user_analytics_summary;
DROP VIEW IF EXISTS public.subscription_analytics_summary;

-- Recreate user_analytics_summary using profiles instead of auth.users
CREATE OR REPLACE VIEW public.user_analytics_summary AS
SELECT 
  p.user_id,
  p.name as user_name,
  u.email,
  u.created_at as joined_at,
  s.subscribed as is_subscribed,
  s.subscription_tier,
  COUNT(DISTINCT c.id) as total_conversations,
  MAX(c.updated_at) as last_activity,
  COALESCE(umu.current_month_usage, 0) as messages_this_month,
  ROUND(AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as avg_conversation_duration_minutes,
  ROUND(AVG(jsonb_array_length(c.messages))::numeric, 2) as avg_messages_per_conversation,
  ROUND(SUM(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as total_conversation_time_minutes,
  ROUND(AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as avg_session_duration_minutes,
  COALESCE(SUM(utu.total_tokens), 0) as total_tokens,
  COALESCE(SUM(utu.input_tokens), 0) as total_input_tokens,
  COALESCE(SUM(utu.output_tokens), 0) as total_output_tokens,
  ROUND(COALESCE(AVG(utu.input_tokens), 0)::numeric, 2) as avg_input_tokens,
  ROUND(COALESCE(AVG(utu.output_tokens), 0)::numeric, 2) as avg_output_tokens,
  ROUND(COALESCE(SUM(utu.estimated_cost), 0)::numeric, 4) as total_cost,
  ROUND(COALESCE(SUM(CASE WHEN utu.created_at >= NOW() - INTERVAL '30 days' THEN utu.estimated_cost ELSE 0 END), 0)::numeric, 4) as cost_last_30_days
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
LEFT JOIN public.subscribers s ON u.id = s.user_id
LEFT JOIN public.chat_conversations c ON u.id = c.user_id
LEFT JOIN public.user_message_usage umu ON u.id = umu.user_id 
  AND umu.usage_month = date_trunc('month', CURRENT_DATE)::date
LEFT JOIN public.user_token_usage utu ON u.id = utu.user_id
GROUP BY p.user_id, p.name, u.email, u.created_at, s.subscribed, s.subscription_tier, umu.current_month_usage;

-- Recreate subscription_analytics_summary without exposing auth.users
CREATE OR REPLACE VIEW public.subscription_analytics_summary AS
WITH subscription_totals AS (
  SELECT 
    subscription_tier,
    COUNT(*) as subscriber_count
  FROM public.subscribers
  WHERE subscribed = true
  GROUP BY subscription_tier
),
revenue_metrics AS (
  SELECT
    -- MRR calculation (Monthly Recurring Revenue)
    SUM(CASE 
      WHEN subscription_tier = 'glow' THEN 15
      WHEN subscription_tier = 'vibe' THEN 30
      WHEN subscription_tier = 'unlimited' THEN 50
      ELSE 0
    END) as monthly_recurring_revenue,
    -- ARR calculation (Annual Recurring Revenue)
    SUM(CASE 
      WHEN subscription_tier = 'glow' THEN 15 * 12
      WHEN subscription_tier = 'vibe' THEN 30 * 12
      WHEN subscription_tier = 'unlimited' THEN 50 * 12
      ELSE 0
    END) as annual_recurring_revenue
  FROM public.subscribers
  WHERE subscribed = true
),
conversion_metrics AS (
  SELECT
    COUNT(DISTINCT CASE WHEN s.subscribed = true THEN p.user_id END)::numeric as paid_subscribers,
    COUNT(DISTINCT p.user_id)::numeric as total_users
  FROM public.profiles p
  LEFT JOIN public.subscribers s ON p.user_id = s.user_id
),
subscription_events_summary AS (
  SELECT
    COUNT(CASE WHEN se.event_type = 'new_subscription' AND se.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as new_subscriptions_this_month,
    COUNT(CASE WHEN se.event_type = 'upgrade' AND se.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as upgrades_this_month,
    COUNT(CASE WHEN se.event_type = 'downgrade' AND se.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as downgrades_this_month,
    COUNT(CASE WHEN se.event_type = 'cancellation' AND se.created_at >= date_trunc('month', CURRENT_DATE) THEN 1 END) as cancellations_this_month,
    ROUND(AVG(EXTRACT(EPOCH FROM (se.created_at - p.created_at)) / 86400)::numeric, 2) as avg_days_to_first_subscription,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (se.created_at - p.created_at)) / 86400) as median_days_to_first_subscription
  FROM public.subscription_events se
  JOIN public.profiles p ON se.user_id = p.user_id
  WHERE se.event_type = 'new_subscription'
)
SELECT
  rm.monthly_recurring_revenue,
  rm.annual_recurring_revenue,
  COALESCE(st_glow.subscriber_count, 0) as glow_subscribers,
  COALESCE(st_vibe.subscriber_count, 0) as vibe_subscribers,
  COALESCE(st_unlimited.subscriber_count, 0) as unlimited_subscribers,
  cm.paid_subscribers::bigint as total_paid_subscribers,
  ses.new_subscriptions_this_month,
  ses.upgrades_this_month,
  ses.downgrades_this_month,
  ses.cancellations_this_month,
  ROUND((cm.paid_subscribers / NULLIF(cm.total_users, 0) * 100)::numeric, 2) as conversion_rate_percentage,
  ROUND((rm.monthly_recurring_revenue / NULLIF(cm.paid_subscribers, 0))::numeric, 2) as average_revenue_per_user,
  ses.avg_days_to_first_subscription,
  ses.median_days_to_first_subscription
FROM revenue_metrics rm
CROSS JOIN conversion_metrics cm
CROSS JOIN subscription_events_summary ses
LEFT JOIN subscription_totals st_glow ON st_glow.subscription_tier = 'glow'
LEFT JOIN subscription_totals st_vibe ON st_vibe.subscription_tier = 'vibe'
LEFT JOIN subscription_totals st_unlimited ON st_unlimited.subscription_tier = 'unlimited';

-- Grant SELECT permissions to authenticated users for admin dashboard access
GRANT SELECT ON public.user_analytics_summary TO authenticated;
GRANT SELECT ON public.subscription_analytics_summary TO authenticated;