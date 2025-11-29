// Types for admin analytics functions and views

export interface UserAnalyticsSummary {
  user_id: string;
  user_name: string | null;
  email: string;
  joined_at: string;
  is_subscribed: boolean;
  subscription_tier: string | null;
  total_conversations: number;
  last_activity: string | null;
  messages_this_month: number;
  avg_conversation_duration_minutes: number;
  avg_messages_per_conversation: number;
  total_conversation_time_minutes: number;
  avg_session_duration_minutes: number;
  total_tokens: number;
  total_input_tokens: number;
  total_output_tokens: number;
  avg_input_tokens: number;
  avg_output_tokens: number;
  total_cost: number;
  cost_last_30_days: number;
}

export interface DailyCostSummary {
  date: string | null;
  model: string | null;
  message_count: number | null;
  total_tokens: number | null;
  total_input_tokens: number | null;
  total_output_tokens: number | null;
  avg_tokens_per_message: number | null;
  avg_input_tokens_per_message: number | null;
  avg_output_tokens_per_message: number | null;
  total_cost: number | null;
  avg_cost_per_message: number | null;
}

export interface SubscriptionAnalyticsSummary {
  monthly_recurring_revenue: number;
  annual_recurring_revenue: number;
  average_revenue_per_user: number;
  conversion_rate_percentage: number;
  glow_subscribers: number;
  vibe_subscribers: number;
  unlimited_subscribers: number;
  total_paid_subscribers: number;
  new_subscriptions_this_month: number;
  upgrades_this_month: number;
  downgrades_this_month: number;
  cancellations_this_month: number;
  avg_days_to_first_subscription: number;
  median_days_to_first_subscription: number;
}

export interface MonthlyRevenueSnapshot {
  id: string;
  snapshot_month: string;
  mrr: number;
  arr: number;
  total_subscribers: number;
  glow_count: number;
  vibe_count: number;
  unlimited_count: number;
  new_subscriptions: number;
  cancellations: number;
  created_at: string;
}
