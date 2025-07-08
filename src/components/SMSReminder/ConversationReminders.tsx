
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare } from "lucide-react";
import { ConversationReminder } from "./types";

interface ConversationRemindersProps {
  conversationReminders: ConversationReminder[];
  onToggleReminder: (reminderId: string, isActive: boolean) => void;
}

const ConversationReminders = ({ conversationReminders, onToggleReminder }: ConversationRemindersProps) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };

  if (conversationReminders.length === 0) return null;

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="w-5 h-5 text-coral-600" />
        <h3 className="text-lg font-semibold">From Your Conversations</h3>
      </div>
      
      <div className="space-y-3">
        {conversationReminders.map(reminder => (
          <div key={reminder.id} className="flex items-center justify-between p-3 bg-coral-50 rounded-lg border border-coral-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{reminder.reminder_text}</p>
              <p className="text-xs text-gray-600">Daily at {formatTime(reminder.reminder_time)}</p>
            </div>
            <Checkbox
              checked={reminder.is_active}
              onCheckedChange={() => onToggleReminder(reminder.id, reminder.is_active)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ConversationReminders;
