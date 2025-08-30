-- Ensure the testing account override exists
INSERT INTO public.account_overrides (email, unlimited_messages)
VALUES ('swortman1994@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET 
  unlimited_messages = EXCLUDED.unlimited_messages,
  updated_at = now();