-- Create subscription events tracking table
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('created', 'upgraded', 'downgraded', 'canceled', 'reactivated')),
  from_tier TEXT,
  to_tier TEXT NOT NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_subscription_events_user_id ON public.subscription_events(user_id);
CREATE INDEX idx_subscription_events_created_at ON public.subscription_events(created_at DESC);
CREATE INDEX idx_subscription_events_event_type ON public.subscription_events(event_type);

-- Enable RLS
ALTER TABLE public.subscription_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all subscription events"
ON public.subscription_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert subscription events"
ON public.subscription_events
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Create subscription analytics summary view
CREATE OR REPLACE VIEW public.subscription_analytics_summary AS
WITH tier_pricing AS (
  SELECT 'glow' AS tier, 19.00 AS monthly_price
  UNION ALL
  SELECT 'vibe', 39.00
  UNION ALL
  SELECT 'unlimited', 79.00
),
current_subscriptions AS (
  SELECT 
    subscription_tier,
    COUNT(*) as subscriber_count
  FROM public.subscribers
  WHERE subscribed = true
    AND subscription_tier IS NOT NULL
  GROUP BY subscription_tier
),
monthly_events AS (
  SELECT
    event_type,
    to_tier,
    COUNT(*) as event_count
  FROM public.subscription_events
  WHERE created_at >= date_trunc('month', CURRENT_DATE)
  GROUP BY event_type, to_tier
),
user_conversion_time AS (
  SELECT 
    se.user_id,
    EXTRACT(EPOCH FROM (se.created_at - au.created_at)) / 86400 as days_to_conversion
  FROM public.subscription_events se
  JOIN auth.users au ON se.user_id = au.id
  WHERE se.event_type = 'created'
)
SELECT
  -- Current subscription metrics
  (SELECT COALESCE(SUM(cs.subscriber_count * tp.monthly_price), 0) 
   FROM current_subscriptions cs 
   JOIN tier_pricing tp ON cs.subscription_tier = tp.tier) as monthly_recurring_revenue,
  
  (SELECT COALESCE(SUM(cs.subscriber_count * tp.monthly_price * 12), 0) 
   FROM current_subscriptions cs 
   JOIN tier_pricing tp ON cs.subscription_tier = tp.tier) as annual_recurring_revenue,
  
  (SELECT COUNT(*) FROM public.subscribers WHERE subscribed = true) as total_paid_subscribers,
  
  -- Monthly events
  (SELECT COALESCE(SUM(event_count), 0) FROM monthly_events WHERE event_type = 'created') as new_subscriptions_this_month,
  (SELECT COALESCE(SUM(event_count), 0) FROM monthly_events WHERE event_type = 'upgraded') as upgrades_this_month,
  (SELECT COALESCE(SUM(event_count), 0) FROM monthly_events WHERE event_type = 'downgraded') as downgrades_this_month,
  (SELECT COALESCE(SUM(event_count), 0) FROM monthly_events WHERE event_type = 'canceled') as cancellations_this_month,
  
  -- Conversion metrics
  (SELECT ROUND(AVG(days_to_conversion)::numeric, 2) FROM user_conversion_time) as avg_days_to_first_subscription,
  (SELECT ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_to_conversion)::numeric, 2) FROM user_conversion_time) as median_days_to_first_subscription,
  
  -- Conversion rate
  ROUND(
    (SELECT COUNT(*) FROM public.subscribers WHERE subscribed = true)::numeric / 
    NULLIF((SELECT COUNT(*) FROM auth.users), 0) * 100, 
    2
  ) as conversion_rate_percentage,
  
  -- ARPU (Average Revenue Per User)
  ROUND(
    (SELECT COALESCE(SUM(cs.subscriber_count * tp.monthly_price), 0) 
     FROM current_subscriptions cs 
     JOIN tier_pricing tp ON cs.subscription_tier = tp.tier) / 
    NULLIF((SELECT COUNT(*) FROM public.subscribers WHERE subscribed = true), 0),
    2
  ) as average_revenue_per_user,
  
  -- Plan distribution
  (SELECT COALESCE(subscriber_count, 0) FROM current_subscriptions WHERE subscription_tier = 'glow') as glow_subscribers,
  (SELECT COALESCE(subscriber_count, 0) FROM current_subscriptions WHERE subscription_tier = 'vibe') as vibe_subscribers,
  (SELECT COALESCE(subscriber_count, 0) FROM current_subscriptions WHERE subscription_tier = 'unlimited') as unlimited_subscribers;