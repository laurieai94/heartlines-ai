-- Drop and recreate user_analytics_summary with conversation metrics
DROP VIEW IF EXISTS user_analytics_summary;

CREATE VIEW user_analytics_summary AS
WITH conversation_metrics AS (
  SELECT 
    user_id,
    id as conversation_id,
    jsonb_array_length(messages) as message_count,
    CASE 
      WHEN jsonb_array_length(messages) > 1 THEN
        EXTRACT(EPOCH FROM (
          (messages->-1->>'timestamp')::timestamp - 
          (messages->0->>'timestamp')::timestamp
        )) / 60.0
      ELSE 0
    END as conversation_duration_minutes,
    EXTRACT(EPOCH FROM (updated_at - created_at)) / 60.0 as session_duration_minutes
  FROM chat_conversations
  WHERE jsonb_array_length(messages) > 0
)
SELECT 
  p.user_id,
  au.email::varchar as email,
  p.name as user_name,
  p.created_at as joined_at,
  s.subscribed as is_subscribed,
  s.subscription_tier,
  COUNT(DISTINCT cc.id) as total_conversations,
  MAX(cc.updated_at) as last_activity,
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
  
  -- NEW: Conversation length metrics
  COALESCE(AVG(cm.message_count), 0) as avg_messages_per_conversation,
  COALESCE(AVG(cm.conversation_duration_minutes), 0) as avg_conversation_duration_minutes,
  COALESCE(AVG(cm.session_duration_minutes), 0) as avg_session_duration_minutes,
  COALESCE(SUM(cm.conversation_duration_minutes), 0) as total_conversation_time_minutes
  
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
LEFT JOIN subscribers s ON p.user_id = s.user_id
LEFT JOIN chat_conversations cc ON p.user_id = cc.user_id
LEFT JOIN user_message_usage umu ON p.user_id = umu.user_id 
  AND umu.usage_month = date_trunc('month', CURRENT_DATE)::date
LEFT JOIN user_token_usage utu ON p.user_id = utu.user_id
LEFT JOIN conversation_metrics cm ON p.user_id = cm.user_id
GROUP BY 
  p.user_id, 
  au.email, 
  p.name, 
  p.created_at, 
  s.subscribed, 
  s.subscription_tier,
  umu.current_month_usage;