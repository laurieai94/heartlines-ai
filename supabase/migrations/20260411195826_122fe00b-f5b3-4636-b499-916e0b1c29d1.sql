
-- 1. Fix kai_opener_history: restrict INSERT to own user_id
DROP POLICY IF EXISTS "Service role can insert opener history" ON public.kai_opener_history;
CREATE POLICY "Users can insert their own opener history"
  ON public.kai_opener_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert opener history"
  ON public.kai_opener_history
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- 2. Fix user_roles: explicitly block authenticated users from inserting
CREATE POLICY "Authenticated users cannot insert roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- 3. Remove subscribers from Realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.subscribers;
