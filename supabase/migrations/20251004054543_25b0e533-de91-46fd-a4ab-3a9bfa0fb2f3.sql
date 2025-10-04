-- Create crisis_logs table for backend monitoring (Layer 2)
CREATE TABLE public.crisis_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  severity text CHECK (severity IN ('high', 'medium', 'low')) NOT NULL,
  crisis_types text[] NOT NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  reviewed boolean DEFAULT false,
  reviewer_notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_crisis_logs_user_id ON public.crisis_logs(user_id);
CREATE INDEX idx_crisis_logs_severity ON public.crisis_logs(severity);
CREATE INDEX idx_crisis_logs_detected_at ON public.crisis_logs(detected_at DESC);

-- Enable RLS (service role only - not accessible to users)
ALTER TABLE public.crisis_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can manage crisis logs (admin/monitoring data only)
CREATE POLICY "Service role can manage crisis logs"
  ON public.crisis_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);