-- Drop existing vulnerable policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure RLS policies for subscribers table
CREATE POLICY "users_can_insert_own_subscription" ON public.subscribers
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.email() = email);

CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
FOR UPDATE 
USING (auth.uid() = user_id OR auth.email() = email);

-- Create policy for service role to bypass RLS (for edge functions)
CREATE POLICY "service_role_full_access" ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role');