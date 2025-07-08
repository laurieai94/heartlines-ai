
export interface ReminderType {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  time: string;
  customMessage?: string;
}

export interface ConversationReminder {
  id: string;
  reminder_text: string;
  reminder_time: string;
  is_active: boolean;
  created_at: string;
}
