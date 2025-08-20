-- Create user_message_usage table to track message consumption
CREATE TABLE public.user_message_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_month_usage INTEGER NOT NULL DEFAULT 0,
  subscription_tier TEXT,
  usage_month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_message_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own usage" 
ON public.user_message_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.user_message_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.user_message_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for edge functions to update usage
CREATE POLICY "Service role can manage usage" 
ON public.user_message_usage 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_message_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_message_usage_updated_at
BEFORE UPDATE ON public.user_message_usage
FOR EACH ROW
EXECUTE FUNCTION public.update_message_usage_updated_at();