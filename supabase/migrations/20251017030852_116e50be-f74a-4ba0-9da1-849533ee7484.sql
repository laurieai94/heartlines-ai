-- Remove admin override to enforce payment limits on all accounts
-- This allows testing the real user experience before launch
DELETE FROM public.account_overrides WHERE email = 'swortman1994@gmail.com';