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
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          notified?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          notified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
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
    }
    Functions: {
      get_subscription_analytics_summary: {
        Args: never
        Returns: {
          annual_recurring_revenue: number
          average_revenue_per_user: number
          avg_days_to_first_subscription: number
          cancellations_this_month: number
          conversion_rate_percentage: number
          downgrades_this_month: number
          glow_subscribers: number
          median_days_to_first_subscription: number
          monthly_recurring_revenue: number
          new_subscriptions_this_month: number
          total_paid_subscribers: number
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
