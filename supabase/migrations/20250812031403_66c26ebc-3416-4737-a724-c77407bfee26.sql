-- Enable required extensions for scheduling and HTTP calls
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Add tracking for when a reminder was last sent
alter table public.user_reminders
  add column if not exists last_sent_at timestamptz;

-- Helpful indexes for due reminder queries
create index if not exists idx_user_reminders_due
  on public.user_reminders (reminder_time, is_active);

create index if not exists idx_user_reminders_user
  on public.user_reminders (user_id);

-- Safely unschedule if it exists
do $$
begin
  perform cron.unschedule('process-due-reminders-every-minute');
exception when others then
  null;
end $$;

-- Schedule the process-due-reminders edge function to run every minute
select
  cron.schedule(
    'process-due-reminders-every-minute',
    '* * * * *', -- every minute
    $$
    select
      net.http_post(
        url := 'https://relqmhrzyqckoaebscgx.supabase.co/functions/v1/process-due-reminders',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{}'::jsonb
      ) as request_id;
    $$
  );