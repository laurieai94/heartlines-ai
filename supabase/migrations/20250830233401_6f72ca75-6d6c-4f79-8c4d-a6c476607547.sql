-- Create table for tracking token usage
CREATE TABLE public.user_token_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id TEXT,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  estimated_cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_token_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own token usage" 
ON public.user_token_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage token usage" 
ON public.user_token_usage 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create index for better performance
CREATE INDEX idx_user_token_usage_user_id_created_at ON public.user_token_usage(user_id, created_at DESC);
CREATE INDEX idx_user_token_usage_model ON public.user_token_usage(model);