
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ConversationReminder } from '../types';

export const useConversationReminders = () => {
  const [conversationReminders, setConversationReminders] = useState<ConversationReminder[]>([]);
  const { user } = useAuth();

  // Load conversation reminders
  useEffect(() => {
    const loadConversationReminders = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_reminders')
          .select('*')
          .eq('user_id', user.id)
          .eq('created_from_conversation', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setConversationReminders(data || []);
      } catch (error) {
        console.error('Error loading conversation reminders:', error);
      }
    };

    loadConversationReminders();
  }, [user]);

  const toggleConversationReminder = async (reminderId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_reminders')
        .update({ is_active: !isActive })
        .eq('id', reminderId);

      if (error) throw error;

      setConversationReminders(prev =>
        prev.map(reminder =>
          reminder.id === reminderId 
            ? { ...reminder, is_active: !isActive }
            : reminder
        )
      );

      toast.success(isActive ? 'Reminder disabled' : 'Reminder enabled');
    } catch (error) {
      console.error('Error updating reminder:', error);
      toast.error('Failed to update reminder');
    }
  };

  const activeConversationReminders = conversationReminders.filter(r => r.is_active);

  return {
    conversationReminders,
    toggleConversationReminder,
    activeConversationReminders
  };
};
