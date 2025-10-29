-- Fix the user_analytics_summary view to remove auth.users exposure
-- Use subscribers.email instead which already has proper RLS

DROP VIEW IF EXISTS user_analytics_summary;

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
message_metrics AS (
  SELECT
    user_id,
    SUM(current_month_usage) as total_messages,
    MAX(updated_at) as last_message_time
  FROM user_message_usage
  GROUP BY user_id
)
SELECT 
  p.user_id,
  COALESCE(s.email, '')::varchar as email,
  p.name as user_name,
  p.created_at as joined_at,
  s.subscribed as is_subscribed,
  s.subscription_tier,
  COALESCE(cm.conversation_count, 0) as total_conversations,
  COALESCE(mm.last_message_time, p.created_at) as last_activity,
  COALESCE(umu.current_month_usage, 0) as messages_this_month,
  
  -- Token metrics
  COALESCE(SUM(utu.total_tokens), 0) as total_tokens,
  COALESCE(SUM(utu.input_tokens), 0) as total_input_tokens,
  COALESCE(SUM(utu.output_tokens), 0) as total_output_tokens,
  COALESCE(AVG(utu.input_tokens), 0) as avg_input_tokens,
  COALESCE(AVG(utu.output_tokens), 0) as avg_output_tokens,
  
  -- Cost metrics
  COALESCE(SUM(utu.estimated_cost), 0) as total_cost,
  COALESCE(SUM(CASE 
    WHEN utu.created_at >= NOW() - INTERVAL '30 days' 
    THEN utu.estimated_cost 
    ELSE 0 
  END), 0) as cost_last_30_days,
  
  -- Conversation metrics
  COALESCE(
    CASE 
      WHEN cm.conversation_count > 0 
      THEN mm.total_messages::numeric / cm.conversation_count 
      ELSE 0 
    END, 
    0
  ) as avg_messages_per_conversation,
  
  COALESCE(cm.avg_session_duration_minutes, 0) as avg_session_duration_minutes,
  COALESCE(cm.avg_session_duration_minutes, 0) as avg_conversation_duration_minutes,
  COALESCE(cm.total_conversation_time_minutes, 0) as total_conversation_time_minutes
  
FROM profiles p
LEFT JOIN subscribers s ON p.user_id = s.user_id
LEFT JOIN user_message_usage umu ON p.user_id = umu.user_id 
  AND umu.usage_month = date_trunc('month', CURRENT_DATE)::date
LEFT JOIN user_token_usage utu ON p.user_id = utu.user_id
LEFT JOIN conversation_metrics cm ON p.user_id = cm.user_id
LEFT JOIN message_metrics mm ON p.user_id = mm.user_id
GROUP BY 
  p.user_id, 
  s.email, 
  p.name, 
  p.created_at, 
  s.subscribed, 
  s.subscription_tier,
  umu.current_month_usage,
  cm.conversation_count,
  cm.avg_session_duration_minutes,
  cm.total_conversation_time_minutes,
  mm.total_messages,
  mm.last_message_time;

-- Only grant to service_role, not to authenticated
GRANT SELECT ON user_analytics_summary TO service_role;