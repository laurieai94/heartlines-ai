-- Add RLS policy for users to view their own crisis logs
-- This provides transparency and allows users to understand when crisis protocols were triggered
CREATE POLICY "Users can view their own crisis logs"
  ON public.crisis_logs
  FOR SELECT
  USING (auth.uid() = user_id);