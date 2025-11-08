-- Enable realtime updates for subscribers table
ALTER TABLE public.subscribers REPLICA IDENTITY FULL;

-- Add subscribers table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;