-- Add email reminder support columns and indexes
-- 1) Table changes
ALTER TABLE public.user_reminders
  ADD COLUMN IF NOT EXISTS delivery_channel text NOT NULL DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS is_one_time boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS send_at timestamp with time zone NULL,
  ADD COLUMN IF NOT EXISTS last_error text NULL;

-- 2) Helpful indexes for faster due selection
-- Active reminders by channel
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_user_reminders_active_channel'
  ) THEN
    EXECUTE 'CREATE INDEX idx_user_reminders_active_channel ON public.user_reminders (delivery_channel) WHERE is_active = true';
  END IF;
END $$;

-- One-time reminders by send_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_user_reminders_send_at'
  ) THEN
    EXECUTE 'CREATE INDEX idx_user_reminders_send_at ON public.user_reminders (send_at) WHERE is_active = true AND is_one_time = true';
  END IF;
END $$;

-- Recurring reminders by reminder_time
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_user_reminders_reminder_time'
  ) THEN
    EXECUTE 'CREATE INDEX idx_user_reminders_reminder_time ON public.user_reminders (reminder_time) WHERE is_active = true AND is_one_time = false';
  END IF;
END $$;

-- 3) Ensure required extensions for scheduling HTTP calls
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- 4) Schedule the email processor to run every minute (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cron.jobs WHERE jobname = 'invoke-process-due-email-reminders-every-minute'
  ) THEN
    PERFORM cron.schedule(
      'invoke-process-due-email-reminders-every-minute',
      '* * * * *',
      $$
      select
        net.http_post(
          url:='https://relqmhrzyqckoaebscgx.supabase.co/functions/v1/process-due-email-reminders',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE"}'::jsonb,
          body:=jsonb_build_object('time', now()::text, 'source', 'cron')
        ) as request_id;
      $$
    );
  END IF;
END $$;