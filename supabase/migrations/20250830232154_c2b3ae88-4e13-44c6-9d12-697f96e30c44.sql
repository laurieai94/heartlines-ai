-- Create account overrides table for testing accounts
CREATE TABLE public.account_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  unlimited_messages BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.account_overrides ENABLE ROW LEVEL SECURITY;

-- Service role can manage all overrides
CREATE POLICY "Service role can manage overrides" 
ON public.account_overrides 
FOR ALL 
USING (auth.role() = 'service_role');

-- Users can view their own override status
CREATE POLICY "Users can view their own override" 
ON public.account_overrides 
FOR SELECT 
USING (email = auth.email());

-- Seed the testing account
INSERT INTO public.account_overrides (email, unlimited_messages)
VALUES ('swortman1994@gmail.com', true);