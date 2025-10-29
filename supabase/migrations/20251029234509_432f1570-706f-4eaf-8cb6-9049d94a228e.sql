-- Fix SECURITY DEFINER view security issue
-- Recreate analytics views with built-in admin access control

-- Drop existing views
DROP VIEW IF EXISTS user_analytics_summary CASCADE;
DROP VIEW IF EXISTS daily_cost_summary CASCADE;

-- Recreate user_analytics_summary with admin-only access built into the view
CREATE VIEW user_analytics_summary AS
WITH conversation_metrics AS (
  SELECT 
    user_id,
    COUNT(*) as conversation_count,
    AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60.0) as avg_session_duration_minutes,
    SUM(EXTRACT(EPOCH FROM (updated_at - created_at)) / 60.0) as total_conversation_time_minutes
  FROM chat_conversations
  GROUP BY user_id
),
token_metrics AS (
  SELECT
    user_id,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_tokens) as total_tokens,
    AVG(input_tokens) as avg_input_tokens,
    AVG(output_tokens) as avg_output_tokens,
    SUM(estimated_cost) as total_cost,
    SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN estimated_cost ELSE 0 END) as cost_last_30_days
  FROM user_token_usage
  GROUP BY user_id
)
SELECT 
  p.user_id,
  s.email::varchar as email,
  p.name as user_name,
  p.created_at as joined_at,
  s.subscribed as is_subscribed,
  s.subscription_tier,
  COALESCE(cm.conversation_count, 0) as total_conversations,
  MAX(cc.updated_at) as last_activity,
  COALESCE(umu.current_month_usage, 0) as messages_this_month,
  COALESCE(tm.total_tokens, 0) as total_tokens,
  COALESCE(tm.total_input_tokens, 0) as total_input_tokens,
  COALESCE(tm.total_output_tokens, 0) as total_output_tokens,
  COALESCE(tm.avg_input_tokens, 0) as avg_input_tokens,
  COALESCE(tm.avg_output_tokens, 0) as avg_output_tokens,
  COALESCE(tm.total_cost, 0) as total_cost,
  COALESCE(tm.cost_last_30_days, 0) as cost_last_30_days,
  COALESCE(cm.total_conversation_time_minutes, 0) as total_conversation_time_minutes,
  COALESCE(cm.avg_session_duration_minutes, 0) as avg_session_duration_minutes,
  COALESCE(cm.conversation_count::numeric / NULLIF(COALESCE(umu.current_month_usage, 0), 0), 0) as avg_messages_per_conversation,
  COALESCE(cm.total_conversation_time_minutes / NULLIF(cm.conversation_count, 0), 0) as avg_conversation_duration_minutes
FROM profiles p
LEFT JOIN subscribers s ON s.user_id = p.user_id
LEFT JOIN conversation_metrics cm ON cm.user_id = p.user_id
LEFT JOIN token_metrics tm ON tm.user_id = p.user_id
LEFT JOIN chat_conversations cc ON cc.user_id = p.user_id
LEFT JOIN user_message_usage umu ON umu.user_id = p.user_id 
  AND umu.usage_month = DATE_TRUNC('month', CURRENT_DATE)
-- SECURITY: Only return data if the requesting user is an admin
WHERE public.has_role(auth.uid(), 'admin')
GROUP BY 
  p.user_id,
  s.email,
  p.name,
  p.created_at,
  s.subscribed,
  s.subscription_tier,
  cm.conversation_count,
  cm.total_conversation_time_minutes,
  cm.avg_session_duration_minutes,
  umu.current_month_usage,
  tm.total_tokens,
  tm.total_input_tokens,
  tm.total_output_tokens,
  tm.avg_input_tokens,
  tm.avg_output_tokens,
  tm.total_cost,
  tm.cost_last_30_days;

-- Recreate daily_cost_summary with admin-only access built into the view
CREATE VIEW daily_cost_summary AS
SELECT 
  date_trunc('day', created_at)::date as date,
  model,
  COUNT(*) as message_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(total_tokens) as total_tokens,
  SUM(estimated_cost) as total_cost,
  AVG(total_tokens) as avg_tokens_per_message,
  AVG(input_tokens) as avg_input_tokens_per_message,
  AVG(output_tokens) as avg_output_tokens_per_message,
  AVG(estimated_cost) as avg_cost_per_message
FROM user_token_usage
-- SECURITY: Only return data if the requesting user is an admin
WHERE public.has_role(auth.uid(), 'admin')
GROUP BY date_trunc('day', created_at)::date, model
ORDER BY date DESC;