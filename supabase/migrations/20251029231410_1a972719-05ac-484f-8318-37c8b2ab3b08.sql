-- Drop and recreate daily_cost_summary view with input/output token averages
DROP VIEW IF EXISTS daily_cost_summary;

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
GROUP BY date_trunc('day', created_at)::date, model
ORDER BY date DESC;

-- Drop and recreate user_analytics_summary view with token averages
DROP VIEW IF EXISTS user_analytics_summary;

CREATE VIEW user_analytics_summary AS
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
  COALESCE(SUM(utu.total_tokens), 0) as total_tokens,
  COALESCE(SUM(utu.input_tokens), 0) as total_input_tokens,
  COALESCE(SUM(utu.output_tokens), 0) as total_output_tokens,
  COALESCE(AVG(utu.input_tokens), 0) as avg_input_tokens,
  COALESCE(AVG(utu.output_tokens), 0) as avg_output_tokens,
  COALESCE(SUM(utu.estimated_cost), 0) as total_cost,
  COALESCE(SUM(CASE 
    WHEN utu.created_at >= NOW() - INTERVAL '30 days' 
    THEN utu.estimated_cost 
    ELSE 0 
  END), 0) as cost_last_30_days
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
LEFT JOIN subscribers s ON p.user_id = s.user_id
LEFT JOIN chat_conversations cc ON p.user_id = cc.user_id
LEFT JOIN user_message_usage umu ON p.user_id = umu.user_id 
  AND umu.usage_month = date_trunc('month', CURRENT_DATE)::date
LEFT JOIN user_token_usage utu ON p.user_id = utu.user_id
GROUP BY 
  p.user_id, 
  au.email, 
  p.name, 
  p.created_at, 
  s.subscribed, 
  s.subscription_tier,
  umu.current_month_usage;