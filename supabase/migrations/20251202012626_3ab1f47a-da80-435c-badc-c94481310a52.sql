-- Create relationship_patterns table for tracking recurring themes
CREATE TABLE IF NOT EXISTS public.relationship_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  pattern_description TEXT,
  frequency INTEGER DEFAULT 1,
  first_seen TIMESTAMPTZ DEFAULT now(),
  last_seen TIMESTAMPTZ DEFAULT now(),
  conversation_ids UUID[],
  context_snippets TEXT[],
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_relationship_patterns_user_id ON public.relationship_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_relationship_patterns_user_pattern ON public.relationship_patterns(user_id, pattern_type);
CREATE INDEX IF NOT EXISTS idx_relationship_patterns_unresolved ON public.relationship_patterns(user_id, is_resolved) WHERE is_resolved = false;

-- Enable RLS
ALTER TABLE public.relationship_patterns ENABLE ROW LEVEL SECURITY;

-- Users can view their own patterns
CREATE POLICY "Users can view their own patterns"
  ON public.relationship_patterns
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own patterns
CREATE POLICY "Users can insert their own patterns"
  ON public.relationship_patterns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own patterns
CREATE POLICY "Users can update their own patterns"
  ON public.relationship_patterns
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can manage all patterns
CREATE POLICY "Service role can manage patterns"
  ON public.relationship_patterns
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_relationship_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER update_relationship_patterns_updated_at
  BEFORE UPDATE ON public.relationship_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_relationship_patterns_updated_at();