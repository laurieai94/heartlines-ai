-- Drop and recreate get_subscription_analytics_summary to add trial users and CAC metrics
DROP FUNCTION IF EXISTS public.get_subscription_analytics_summary();

CREATE OR REPLACE FUNCTION public.get_subscription_analytics_summary()
RETURNS TABLE(
  monthly_recurring_revenue numeric,
  annual_recurring_revenue numeric,
  glow_subscribers bigint,
  vibe_subscribers bigint,
  unlimited_subscribers bigint,
  total_paid_subscribers bigint,
  new_subscriptions_this_month bigint,
  upgrades_this_month bigint,
  downgrades_this_month bigint,
  cancellations_this_month bigint,
  conversion_rate_percentage numeric,
  average_revenue_per_user numeric,
  avg_days_to_first_subscription numeric,
  median_days_to_first_subscription numeric,
  avg_cost_per_trial_user numeric,
  total_trial_users bigint,
  cac_per_conversion numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      SUM(CASE 
        WHEN subscription_tier = 'glow' THEN 15
        WHEN subscription_tier = 'vibe' THEN 30
        WHEN subscription_tier = 'unlimited' THEN 50
        ELSE 0
      END) as monthly_recurring_revenue,
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
  ),
  trial_user_avg_cost AS (
    SELECT 
      ROUND(COALESCE(AVG(user_total_cost), 0)::numeric, 4) as avg_cost_per_trial
    FROM (
      SELECT 
        u.id,
        COALESCE(SUM(utu.estimated_cost), 0) as user_total_cost
      FROM auth.users u
      LEFT JOIN public.subscribers s ON u.id = s.user_id
      LEFT JOIN public.user_token_usage utu ON u.id = utu.user_id
      WHERE s.subscribed IS NOT TRUE OR s.subscribed IS NULL
      GROUP BY u.id
    ) trial_costs
  ),
  trial_count AS (
    SELECT COUNT(*)::bigint as total_trial
    FROM auth.users u
    LEFT JOIN public.subscribers s ON u.id = s.user_id
    WHERE s.subscribed IS NOT TRUE OR s.subscribed IS NULL
  ),
  total_api_costs AS (
    SELECT COALESCE(SUM(estimated_cost), 0) as total_cost
    FROM public.user_token_usage
  )
  SELECT
    rm.monthly_recurring_revenue,
    rm.annual_recurring_revenue,
    COALESCE(st_glow.subscriber_count, 0)::bigint as glow_subscribers,
    COALESCE(st_vibe.subscriber_count, 0)::bigint as vibe_subscribers,
    COALESCE(st_unlimited.subscriber_count, 0)::bigint as unlimited_subscribers,
    cm.paid_subscribers::bigint as total_paid_subscribers,
    ses.new_subscriptions_this_month,
    ses.upgrades_this_month,
    ses.downgrades_this_month,
    ses.cancellations_this_month,
    ROUND((cm.paid_subscribers / NULLIF(cm.total_users, 0) * 100)::numeric, 2) as conversion_rate_percentage,
    ROUND((rm.monthly_recurring_revenue / NULLIF(cm.paid_subscribers, 0))::numeric, 2) as average_revenue_per_user,
    ses.avg_days_to_first_subscription,
    ses.median_days_to_first_subscription,
    tuac.avg_cost_per_trial as avg_cost_per_trial_user,
    tc.total_trial as total_trial_users,
    ROUND((tac.total_cost / NULLIF(cm.paid_subscribers, 0))::numeric, 4) as cac_per_conversion
  FROM revenue_metrics rm
  CROSS JOIN conversion_metrics cm
  CROSS JOIN subscription_events_summary ses
  CROSS JOIN trial_user_avg_cost tuac
  CROSS JOIN trial_count tc
  CROSS JOIN total_api_costs tac
  LEFT JOIN subscription_totals st_glow ON st_glow.subscription_tier = 'glow'
  LEFT JOIN subscription_totals st_vibe ON st_vibe.subscription_tier = 'vibe'
  LEFT JOIN subscription_totals st_unlimited ON st_unlimited.subscription_tier = 'unlimited'
  WHERE public.has_role(auth.uid(), 'admin'::app_role);
$function$;