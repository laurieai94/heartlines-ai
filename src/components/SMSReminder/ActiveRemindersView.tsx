
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Settings, X, MessageSquare } from "lucide-react";
import { ReminderType, ConversationReminder } from "./types";

interface ActiveRemindersViewProps {
  phoneNumber: string;
  enabledReminders: ReminderType[];
  activeConversationReminders: ConversationReminder[];
  onEditSettings: () => void;
  onDisable: () => void;
  onUpdateReminderType: (id: string, updates: Partial<ReminderType>) => void;
  onToggleConversationReminder: (reminderId: string, isActive: boolean) => void;
}

const ActiveRemindersView = ({
  phoneNumber,
  enabledReminders,
  activeConversationReminders,
  onEditSettings,
  onDisable,
  onUpdateReminderType,
  onToggleConversationReminder
}: ActiveRemindersViewProps) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMS Reminders</h2>
          <p className="text-gray-600">Your text message reminders are active</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Active</span>
        </div>
      </div>

      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold">Phone Number</h3>
            <p className="text-sm text-gray-600">{phoneNumber}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Conversation Reminders */}
          {activeConversationReminders.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-coral-500" />
                From Conversations ({activeConversationReminders.length})
              </h4>
              {activeConversationReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-coral-50 rounded-lg border border-coral-200 mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{reminder.reminder_text}</p>
                    <p className="text-xs text-gray-600">Daily at {formatTime(reminder.reminder_time)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleConversationReminder(reminder.id, reminder.is_active)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Preset Reminders */}
          {enabledReminders.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900">Preset Reminders ({enabledReminders.length})</h4>
              {enabledReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 mt-2">
                  <div>
                    <p className="font-medium text-gray-900">{reminder.name}</p>
                    <p className="text-sm text-gray-600">Daily at {reminder.time}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateReminderType(reminder.id, { enabled: false })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onEditSettings}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit Settings
          </Button>
          <Button
            variant="destructive"
            onClick={onDisable}
          >
            Disable SMS
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ActiveRemindersView;
