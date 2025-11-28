-- Update get_user_analytics_summary function to handle string-typed messages
CREATE OR REPLACE FUNCTION public.get_user_analytics_summary()
 RETURNS TABLE(user_id uuid, user_name text, email character varying, joined_at timestamp with time zone, is_subscribed boolean, subscription_tier text, total_conversations bigint, last_activity timestamp with time zone, messages_this_month integer, avg_conversation_duration_minutes numeric, avg_messages_per_conversation numeric, total_conversation_time_minutes numeric, avg_session_duration_minutes numeric, total_tokens bigint, total_input_tokens bigint, total_output_tokens bigint, avg_input_tokens numeric, avg_output_tokens numeric, total_cost numeric, cost_last_30_days numeric)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Only allow admins to access this data
  SELECT 
    p.user_id,
    p.name as user_name,
    u.email::varchar,
    u.created_at as joined_at,
    s.subscribed as is_subscribed,
    s.subscription_tier,
    COUNT(DISTINCT c.id) as total_conversations,
    MAX(c.updated_at) as last_activity,
    COALESCE(umu.current_month_usage, 0) as messages_this_month,
    ROUND(AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as avg_conversation_duration_minutes,
    ROUND(AVG(
      CASE 
        WHEN jsonb_typeof(c.messages) = 'string' THEN jsonb_array_length(c.messages::text::jsonb)
        ELSE jsonb_array_length(c.messages)
      END
    )::numeric, 2) as avg_messages_per_conversation,
    ROUND(SUM(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as total_conversation_time_minutes,
    ROUND(AVG(EXTRACT(EPOCH FROM (c.updated_at - c.created_at)) / 60)::numeric, 2) as avg_session_duration_minutes,
    COALESCE(SUM(utu.total_tokens), 0) as total_tokens,
    COALESCE(SUM(utu.input_tokens), 0) as total_input_tokens,
    COALESCE(SUM(utu.output_tokens), 0) as total_output_tokens,
    ROUND(COALESCE(AVG(utu.input_tokens), 0)::numeric, 2) as avg_input_tokens,
    ROUND(COALESCE(AVG(utu.output_tokens), 0)::numeric, 2) as avg_output_tokens,
    ROUND(COALESCE(SUM(utu.estimated_cost), 0)::numeric, 4) as total_cost,
    ROUND(COALESCE(SUM(CASE WHEN utu.created_at >= NOW() - INTERVAL '30 days' THEN utu.estimated_cost ELSE 0 END), 0)::numeric, 4) as cost_last_30_days
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.user_id
  LEFT JOIN public.subscribers s ON u.id = s.user_id
  LEFT JOIN public.chat_conversations c ON u.id = c.user_id
  LEFT JOIN public.user_message_usage umu ON u.id = umu.user_id 
    AND umu.usage_month = date_trunc('month', CURRENT_DATE)::date
  LEFT JOIN public.user_token_usage utu ON u.id = utu.user_id
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY p.user_id, p.name, u.email, u.created_at, s.subscribed, s.subscription_tier, umu.current_month_usage;
$function$;

-- Fix existing data: convert string-stored messages to proper JSONB arrays
UPDATE public.chat_conversations 
SET messages = messages::text::jsonb
WHERE jsonb_typeof(messages) = 'string';