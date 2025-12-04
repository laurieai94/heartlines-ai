-- Create table to track Kai opener usage for variety enforcement
CREATE TABLE public.kai_opener_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  opener_category TEXT NOT NULL,
  opener_text TEXT NOT NULL,
  scenario_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kai_opener_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own opener history
CREATE POLICY "Users can view their own opener history"
  ON public.kai_opener_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert (edge function uses service role)
CREATE POLICY "Service role can insert opener history"
  ON public.kai_opener_history
  FOR INSERT
  WITH CHECK (true);

-- Index for efficient queries
CREATE INDEX idx_kai_opener_user_recent ON public.kai_opener_history (user_id, created_at DESC);
CREATE INDEX idx_kai_opener_text ON public.kai_opener_history (opener_text);

-- View for analytics: top openers and usage percentage
CREATE OR REPLACE VIEW public.kai_opener_analytics AS
SELECT 
  opener_text,
  opener_category,
  COUNT(*) as usage_count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM public.kai_opener_history), 0) * 100, 2) as usage_percent,
  MAX(created_at) as last_used
FROM public.kai_opener_history
GROUP BY opener_text, opener_category
ORDER BY usage_count DESC;