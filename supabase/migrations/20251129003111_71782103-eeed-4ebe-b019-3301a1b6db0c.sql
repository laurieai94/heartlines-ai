-- Create table for monthly revenue snapshots to track historical trends
CREATE TABLE public.monthly_revenue_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_month DATE NOT NULL UNIQUE,
  mrr NUMERIC NOT NULL DEFAULT 0,
  arr NUMERIC NOT NULL DEFAULT 0,
  total_subscribers INTEGER NOT NULL DEFAULT 0,
  glow_count INTEGER DEFAULT 0,
  vibe_count INTEGER DEFAULT 0,
  unlimited_count INTEGER DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  cancellations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.monthly_revenue_snapshots ENABLE ROW LEVEL SECURITY;

-- Only admins can view revenue snapshots
CREATE POLICY "Admins can view revenue snapshots"
ON public.monthly_revenue_snapshots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

-- Service role can insert snapshots (for cron jobs)
CREATE POLICY "Service role can insert snapshots"
ON public.monthly_revenue_snapshots
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Create index for faster queries
CREATE INDEX idx_monthly_revenue_snapshots_month ON public.monthly_revenue_snapshots(snapshot_month DESC);