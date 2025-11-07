-- Add unique constraint to stripe_customer_id to enable ON CONFLICT upserts
ALTER TABLE public.subscribers 
ADD CONSTRAINT subscribers_stripe_customer_id_key 
UNIQUE (stripe_customer_id);