
import { useState } from 'react';
import { ReminderType } from '../types';

export const useReminderTypes = () => {
  const [reminderTypes, setReminderTypes] = useState<ReminderType[]>([
    {
      id: "date-night",
      name: "Date Night Reminders",
      description: "Get reminded to plan quality time together",
      enabled: false,
      time: "18:00",
      customMessage: "Time to plan something special with your partner!"
    },
    {
      id: "check-in",
      name: "Daily Check-ins",
      description: "Remember to ask how their day is going",
      enabled: false,
      time: "17:00",
      customMessage: "Don't forget to check in with your partner about their day"
    },
    {
      id: "appreciation",
      name: "Appreciation Reminders",
      description: "Prompts to express gratitude and love",
      enabled: false,
      time: "09:00",
      customMessage: "Send your partner a quick appreciation message today!"
    },
    {
      id: "conflict-resolution",
      name: "Post-Conflict Follow-up",
      description: "Gentle reminders after disagreements",
      enabled: false,
      time: "20:00",
      customMessage: "Consider reaching out to reconnect after today's discussion"
    },
    {
      id: "special-occasions",
      name: "Special Occasions",
      description: "Never forget anniversaries and important dates",
      enabled: false,
      time: "08:00",
      customMessage: "Don't forget about the special occasion coming up!"
    }
  ]);

  const updateReminderType = (id: string, updates: Partial<ReminderType>) => {
    setReminderTypes(prev => 
      prev.map(type => 
        type.id === id ? { ...type, ...updates } : type
      )
    );
  };

  const enabledReminders = reminderTypes.filter(type => type.enabled);

  return {
    reminderTypes,
    updateReminderType,
    enabledReminders
  };
};
