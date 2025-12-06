export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_overrides: {
        Row: {
          created_at: string
          email: string
          id: string
          unlimited_messages: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          unlimited_messages?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          unlimited_messages?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      api_request_metrics: {
        Row: {
          created_at: string
          error_code: number | null
          error_type: string | null
          id: string
          input_tokens: number | null
          model: string
          output_tokens: number | null
          response_time_ms: number
          retry_count: number
          success: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          error_code?: number | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          model: string
          output_tokens?: number | null
          response_time_ms: number
          retry_count?: number
          success: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          error_code?: number | null
          error_type?: string | null
          id?: string
          input_tokens?: number | null
          model?: string
          output_tokens?: number | null
          response_time_ms?: number
          retry_count?: number
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      cache_alert_state: {
        Row: {
          alert_type: string
          created_at: string | null
          id: string
          last_sent_at: string | null
          last_value: number | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          last_value?: number | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          id?: string
          last_sent_at?: string | null
          last_value?: number | null
        }
        Relationships: []
      }
      cache_metrics: {
        Row: {
          cache_creation_tokens: number
          cache_hit_rate: number | null
          cache_read_tokens: number
          created_at: string
          estimated_cost_savings: number
          id: string
          model: string
          total_input_tokens: number
          user_id: string
        }
        Insert: {
          cache_creation_tokens?: number
          cache_hit_rate?: number | null
          cache_read_tokens?: number
          created_at?: string
          estimated_cost_savings?: number
          id?: string
          model: string
          total_input_tokens?: number
          user_id: string
        }
        Update: {
          cache_creation_tokens?: number
          cache_hit_rate?: number | null
          cache_read_tokens?: number
          created_at?: string
          estimated_cost_savings?: number
          id?: string
          model?: string
          total_input_tokens?: number
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          messages?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          conversation_count: number
          created_at: string
          id: string
          key_topics: string[] | null
          last_updated: string
          summary_text: string
          user_id: string
        }
        Insert: {
          conversation_count?: number
          created_at?: string
          id?: string
          key_topics?: string[] | null
          last_updated?: string
          summary_text: string
          user_id: string
        }
        Update: {
          conversation_count?: number
          created_at?: string
          id?: string
          key_topics?: string[] | null
          last_updated?: string
          summary_text?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_topics: {
        Row: {
          frequency: number
          id: string
          mentioned_at: string
          topic: string
          user_id: string
        }
        Insert: {
          frequency?: number
          id?: string
          mentioned_at?: string
          topic: string
          user_id: string
        }
        Update: {
          frequency?: number
          id?: string
          mentioned_at?: string
          topic?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          content: string
          created_at: string
          days_remaining: number
          id: string
          reflection_cadence: number
          reflection_frequency: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          days_remaining: number
          id?: string
          reflection_cadence?: number
          reflection_frequency?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          days_remaining?: number
          id?: string
          reflection_cadence?: number
          reflection_frequency?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crisis_logs: {
        Row: {
          created_at: string | null
          crisis_types: string[]
          detected_at: string
          id: string
          reviewed: boolean | null
          reviewer_notes: string | null
          severity: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          crisis_types: string[]
          detected_at?: string
          id?: string
          reviewed?: boolean | null
          reviewer_notes?: string | null
          severity: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          crisis_types?: string[]
          detected_at?: string
          id?: string
          reviewed?: boolean | null
          reviewer_notes?: string | null
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      kai_opener_history: {
        Row: {
          created_at: string
          id: string
          opener_category: string
          opener_text: string
          scenario_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opener_category: string
          opener_text: string
          scenario_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opener_category?: string
          opener_text?: string
          scenario_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      launch_limits: {
        Row: {
          auto_throttle_enabled: boolean
          created_at: string | null
          id: string
          max_concurrent_users: number
          max_daily_ai_spend: number
          spend_check_window_hours: number
          updated_at: string | null
          waitlist_active: boolean
          waitlist_message: string | null
        }
        Insert: {
          auto_throttle_enabled?: boolean
          created_at?: string | null
          id?: string
          max_concurrent_users?: number
          max_daily_ai_spend?: number
          spend_check_window_hours?: number
          updated_at?: string | null
          waitlist_active?: boolean
          waitlist_message?: string | null
        }
        Update: {
          auto_throttle_enabled?: boolean
          created_at?: string | null
          id?: string
          max_concurrent_users?: number
          max_daily_ai_spend?: number
          spend_check_window_hours?: number
          updated_at?: string | null
          waitlist_active?: boolean
          waitlist_message?: string | null
        }
        Relationships: []
      }
      monthly_revenue_snapshots: {
        Row: {
          arr: number
          cancellations: number | null
          created_at: string | null
          glow_count: number | null
          id: string
          mrr: number
          new_subscriptions: number | null
          snapshot_month: string
          total_subscribers: number
          unlimited_count: number | null
          vibe_count: number | null
        }
        Insert: {
          arr?: number
          cancellations?: number | null
          created_at?: string | null
          glow_count?: number | null
          id?: string
          mrr?: number
          new_subscriptions?: number | null
          snapshot_month: string
          total_subscribers?: number
          unlimited_count?: number | null
          vibe_count?: number | null
        }
        Update: {
          arr?: number
          cancellations?: number | null
          created_at?: string | null
          glow_count?: number | null
          id?: string
          mrr?: number
          new_subscriptions?: number | null
          snapshot_month?: string
          total_subscribers?: number
          unlimited_count?: number | null
          vibe_count?: number | null
        }
        Relationships: []
      }
      onboarding_status: {
        Row: {
          created_at: string
          id: string
          onboarding_completed: boolean
          partner_profile_completed: boolean
          profile_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          onboarding_completed?: boolean
          partner_profile_completed?: boolean
          profile_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          onboarding_completed?: boolean
          partner_profile_completed?: boolean
          profile_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relationship_patterns: {
        Row: {
          context_snippets: string[] | null
          conversation_ids: string[] | null
          created_at: string | null
          first_seen: string | null
          frequency: number | null
          id: string
          is_resolved: boolean | null
          last_seen: string | null
          pattern_description: string | null
          pattern_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_snippets?: string[] | null
          conversation_ids?: string[] | null
          created_at?: string | null
          first_seen?: string | null
          frequency?: number | null
          id?: string
          is_resolved?: boolean | null
          last_seen?: string | null
          pattern_description?: string | null
          pattern_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_snippets?: string[] | null
          conversation_ids?: string[] | null
          created_at?: string | null
          first_seen?: string | null
          frequency?: number | null
          id?: string
          is_resolved?: boolean | null
          last_seen?: string | null
          pattern_description?: string | null
          pattern_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      signup_cap: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean
          max_users: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          max_users?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean
          max_users?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_events: {
        Row: {
          created_at: string | null
          event_type: string
          from_tier: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          to_tier: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          from_tier?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          to_tier: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          from_tier?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          to_tier?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_message_usage: {
        Row: {
          created_at: string
          current_month_usage: number
          id: string
          subscription_tier: string | null
          updated_at: string
          usage_month: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_month_usage?: number
          id?: string
          subscription_tier?: string | null
          updated_at?: string
          usage_month?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_month_usage?: number
          id?: string
          subscription_tier?: string | null
          updated_at?: string
          usage_month?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          demographics_data: Json
          id: string
          profile_data: Json
          profile_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demographics_data?: Json
          id?: string
          profile_data?: Json
          profile_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          demographics_data?: Json
          id?: string
          profile_data?: Json
          profile_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reminders: {
        Row: {
          conversation_message_id: number | null
          created_at: string
          created_from_conversation: boolean
          id: string
          is_active: boolean
          last_sent_at: string | null
          reminder_days: string[] | null
          reminder_text: string
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_message_id?: number | null
          created_at?: string
          created_from_conversation?: boolean
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          reminder_days?: string[] | null
          reminder_text: string
          reminder_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_message_id?: number | null
          created_at?: string
          created_from_conversation?: boolean
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          reminder_days?: string[] | null
          reminder_text?: string
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_token_usage: {
        Row: {
          created_at: string
          estimated_cost: number
          id: string
          input_tokens: number
          message_id: string | null
          model: string
          output_tokens: number
          total_tokens: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number
          id?: string
          input_tokens?: number
          message_id?: string | null
          model: string
          output_tokens?: number
          total_tokens?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number
          id?: string
          input_tokens?: number
          message_id?: string | null
          model?: string
          output_tokens?: number
          total_tokens?: number | null
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          notified: boolean | null
          priority_code: string | null
          priority_expires_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          notified?: boolean | null
          priority_code?: string | null
          priority_expires_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          notified?: boolean | null
          priority_code?: string | null
          priority_expires_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_ai_spend_summary: {
        Row: {
          request_count: number | null
          spend_date: string | null
          total_cost: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      daily_api_health_summary: {
        Row: {
          auth_errors: number | null
          avg_response_time_ms: number | null
          avg_retries: number | null
          date: string | null
          model: string | null
          overload_errors: number | null
          p50_response_time_ms: number | null
          p95_response_time_ms: number | null
          p99_response_time_ms: number | null
          rate_limit_errors: number | null
          requests_with_retries: number | null
          success_rate_percent: number | null
          successful_requests: number | null
          timeout_errors: number | null
          total_requests: number | null
          total_retries: number | null
        }
        Relationships: []
      }
      daily_cache_summary: {
        Row: {
          cache_hit_rate_percent: number | null
          date: string | null
          model: string | null
          request_count: number | null
          total_cache_creation_tokens: number | null
          total_cache_read_tokens: number | null
          total_cost_savings: number | null
          total_input_tokens: number | null
        }
        Relationships: []
      }
      daily_cost_summary: {
        Row: {
          avg_cost_per_message: number | null
          avg_input_tokens_per_message: number | null
          avg_output_tokens_per_message: number | null
          avg_tokens_per_message: number | null
          date: string | null
          message_count: number | null
          model: string | null
          total_cost: number | null
          total_input_tokens: number | null
          total_output_tokens: number | null
          total_tokens: number | null
        }
        Relationships: []
      }
      hourly_ai_spend: {
        Row: {
          hour: string | null
          hourly_cost: number | null
          request_count: number | null
        }
        Relationships: []
      }
      kai_opener_analytics: {
        Row: {
          last_used: string | null
          opener_category: string | null
          opener_text: string | null
          usage_count: number | null
          usage_percent: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_priority_code: { Args: never; Returns: string }
      get_subscription_analytics_summary: {
        Args: never
        Returns: {
          annual_recurring_revenue: number
          average_revenue_per_user: number
          avg_cost_per_trial_user: number
          avg_days_to_first_subscription: number
          cac_per_conversion: number
          cancellations_this_month: number
          conversion_rate_percentage: number
          downgrades_this_month: number
          glow_subscribers: number
          median_days_to_first_subscription: number
          monthly_recurring_revenue: number
          new_subscriptions_this_month: number
          total_paid_subscribers: number
          total_trial_users: number
          unlimited_subscribers: number
          upgrades_this_month: number
          vibe_subscribers: number
        }[]
      }
      get_user_analytics_summary: {
        Args: never
        Returns: {
          avg_conversation_duration_minutes: number
          avg_input_tokens: number
          avg_messages_per_conversation: number
          avg_output_tokens: number
          avg_session_duration_minutes: number
          cost_last_30_days: number
          email: string
          is_subscribed: boolean
          joined_at: string
          last_activity: string
          messages_this_month: number
          subscription_tier: string
          total_conversation_time_minutes: number
          total_conversations: number
          total_cost: number
          total_input_tokens: number
          total_output_tokens: number
          total_tokens: number
          user_id: string
          user_name: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_message_usage: {
        Args: { p_delta?: number; p_usage_month?: string; p_user_id: string }
        Returns: undefined
      }
      upsert_user_profile_patch: {
        Args: { p_patch: Json; p_profile_type: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
