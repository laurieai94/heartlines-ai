-- Create user analytics summary view for admin dashboard
CREATE VIEW user_analytics_summary AS
SELECT 
  u.id as user_id,
  u.email,
  u.created_at as joined_at,
  p.name as user_name,
  COALESCE(s.subscription_tier, 'free') as subscription_tier,
  COALESCE(s.subscribed, false) as is_subscribed,
  COUNT(DISTINCT cc.id) as total_conversations,
  COALESCE(SUM(utu.estimated_cost), 0) as total_cost,
  COALESCE(SUM(utu.estimated_cost) FILTER (WHERE utu.created_at >= NOW() - INTERVAL '30 days'), 0) as cost_last_30_days,
  COALESCE(SUM(utu.input_tokens + utu.output_tokens), 0) as total_tokens,
  COALESCE(SUM(utu.input_tokens), 0) as total_input_tokens,
  COALESCE(SUM(utu.output_tokens), 0) as total_output_tokens,
  COALESCE(umu.current_month_usage, 0) as messages_this_month,
  MAX(utu.created_at) as last_activity
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.chat_conversations cc ON cc.user_id = u.id
LEFT JOIN public.user_token_usage utu ON utu.user_id = u.id
LEFT JOIN public.user_message_usage umu ON umu.user_id = u.id 
  AND umu.usage_month = DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN public.subscribers s ON s.user_id = u.id
GROUP BY u.id, u.email, u.created_at, p.name, s.subscription_tier, s.subscribed, umu.current_month_usage;

-- Create daily cost summary view for analytics
CREATE VIEW daily_cost_summary AS
SELECT 
  DATE(created_at) as date,
  model,
  COUNT(*) as message_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(input_tokens + output_tokens) as total_tokens,
  SUM(estimated_cost) as total_cost,
  AVG(estimated_cost) as avg_cost_per_message,
  AVG(input_tokens + output_tokens) as avg_tokens_per_message
FROM public.user_token_usage
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE(created_at), model
ORDER BY date DESC;

-- Grant access to authenticated users (admin check will be done in application layer)
GRANT SELECT ON user_analytics_summary TO authenticated;
GRANT SELECT ON daily_cost_summary TO authenticated;