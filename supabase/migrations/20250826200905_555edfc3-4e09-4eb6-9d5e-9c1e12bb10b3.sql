-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to process due reminders every minute
SELECT cron.schedule(
  'process-due-reminders-every-minute',
  '* * * * *', -- every minute
  $$
  SELECT
    net.http_post(
        url:='https://relqmhrzyqckoaebscgx.supabase.co/functions/v1/process-due-reminders',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'X-CRON-KEY', current_setting('app.cron_secret_key', true)
        ),
        body:=jsonb_build_object('scheduled_at', now()::text)
    ) as request_id;
  $$
);

-- Set the cron secret key as a database setting (you'll need to update this with your actual secret)
-- This is a placeholder - the actual secret will be managed through Supabase secrets
ALTER DATABASE postgres SET app.cron_secret_key = 'placeholder-will-be-set-via-supabase-secrets';