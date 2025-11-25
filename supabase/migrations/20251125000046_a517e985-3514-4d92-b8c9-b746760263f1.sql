-- Update signup cap to 500 users
UPDATE public.signup_cap 
SET max_users = 500, 
    updated_at = now()
WHERE id IS NOT NULL;