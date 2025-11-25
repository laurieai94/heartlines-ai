-- Create conversation_summaries table for cross-session memory
CREATE TABLE public.conversation_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  summary_text TEXT NOT NULL,
  key_topics TEXT[] DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  conversation_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversation_summaries ENABLE ROW LEVEL SECURITY;

-- Users can view their own summaries
CREATE POLICY "Users can view their own conversation summaries"
ON public.conversation_summaries
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own summaries
CREATE POLICY "Users can create their own conversation summaries"
ON public.conversation_summaries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own summaries
CREATE POLICY "Users can update their own conversation summaries"
ON public.conversation_summaries
FOR UPDATE
USING (auth.uid() = user_id);

-- Service role can manage summaries
CREATE POLICY "Service role can manage conversation summaries"
ON public.conversation_summaries
FOR ALL
USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_conversation_summaries_user_id ON public.conversation_summaries(user_id);

-- Add trigger to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_conversation_summary_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE TRIGGER update_conversation_summaries_updated_at
BEFORE UPDATE ON public.conversation_summaries
FOR EACH ROW
EXECUTE FUNCTION update_conversation_summary_updated_at();