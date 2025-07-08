import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Clock, Phone, Settings, Eye, Save, X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ReminderType {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  time: string;
  customMessage?: string;
}

interface ConversationReminder {
  id: string;
  reminder_text: string;
  reminder_time: string;
  is_active: boolean;
  created_at: string;
}

const SMSReminder = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [conversationReminders, setConversationReminders] = useState<ConversationReminder[]>([]);
  const { user } = useAuth();

  const [reminderTypes, setReminderTypes] = useState<ReminderType[]>([
    {
      id: "date-night",
      name: "Date Night Reminders",
      description: "Get reminded to plan quality time together",
      enabled: false,
      time: "18:00",
      customMessage: "Time to plan something special with your partner! 💕"
    },
    {
      id: "check-in",
      name: "Daily Check-ins",
      description: "Remember to ask how their day is going",
      enabled: false,
      time: "17:00",
      customMessage: "Don't forget to check in with your partner about their day 😊"
    },
    {
      id: "appreciation",
      name: "Appreciation Reminders",
      description: "Prompts to express gratitude and love",
      enabled: false,
      time: "09:00",
      customMessage: "Send your partner a quick appreciation message today! 🌟"
    },
    {
      id: "conflict-resolution",
      name: "Post-Conflict Follow-up",
      description: "Gentle reminders after disagreements",
      enabled: false,
      time: "20:00",
      customMessage: "Consider reaching out to reconnect after today's discussion 💙"
    },
    {
      id: "special-occasions",
      name: "Special Occasions",
      description: "Never forget anniversaries and important dates",
      enabled: false,
      time: "08:00",
      customMessage: "Don't forget about the special occasion coming up! 🎉"
    }
  ]);

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

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      setIsPhoneValid(true);
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    setIsPhoneValid(cleaned.length === 10);
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const updateReminderType = (id: string, updates: Partial<ReminderType>) => {
    setReminderTypes(prev => 
      prev.map(type => 
        type.id === id ? { ...type, ...updates } : type
      )
    );
  };

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

  const enabledReminders = reminderTypes.filter(type => type.enabled);
  const activeConversationReminders = conversationReminders.filter(r => r.is_active);

  const handleSaveSettings = () => {
    if (!isPhoneValid) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (enabledReminders.length === 0 && activeConversationReminders.length === 0) {
      toast.error("Please select at least one reminder type or create reminders from conversations");
      return;
    }

    setIsEnabled(true);
    toast.success("SMS reminders have been set up successfully!");
  };

  const handleDisable = () => {
    setIsEnabled(false);
    toast.success("SMS reminders have been disabled");
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };

  if (isEnabled) {
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
                      onClick={() => toggleConversationReminder(reminder.id, reminder.is_active)}
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
                      onClick={() => updateReminderType(reminder.id, { enabled: false })}
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
              onClick={() => setIsEnabled(false)}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
            >
              Disable SMS
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Set Up SMS Reminders</h2>
        <p className="text-gray-600">Get gentle text reminders to strengthen your relationship</p>
      </div>

      {/* Phone Number Input */}
      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Phone Number</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Mobile Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={`${isPhoneValid ? 'border-green-500' : ''}`}
          />
          {isPhoneValid && (
            <p className="text-sm text-green-600">✓ Valid phone number</p>
          )}
        </div>
      </Card>

      {/* Conversation Reminders Display */}
      {conversationReminders.length > 0 && (
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
                  onCheckedChange={() => toggleConversationReminder(reminder.id, reminder.is_active)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reminder Types */}
      <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-coral-600" />
          <h3 className="text-lg font-semibold">Reminder Types</h3>
        </div>
        
        <div className="space-y-4">
          {reminderTypes.map(type => (
            <div key={type.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={type.enabled}
                  onCheckedChange={(checked) => 
                    updateReminderType(type.id, { enabled: !!checked })
                  }
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
              
              {type.enabled && (
                <div className="ml-6 space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Label>Reminder Time</Label>
                    <Select
                      value={type.time}
                      onValueChange={(value) => updateReminderType(type.id, { time: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return (
                            <SelectItem key={i} value={`${hour}:00`}>
                              {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Custom Message (Optional)</Label>
                    <Textarea
                      placeholder="Customize your reminder message..."
                      value={type.customMessage || ''}
                      onChange={(e) => updateReminderType(type.id, { customMessage: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Preview */}
      {(enabledReminders.length > 0 || activeConversationReminders.length > 0) && (
        <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Message Preview</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </Button>
          </div>
          
          {showPreview && (
            <div className="space-y-3">
              {enabledReminders.map(reminder => (
                <div key={reminder.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">{reminder.name}</p>
                    <p className="text-xs text-gray-500">Daily at {reminder.time}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-sm text-gray-800">
                      📱 RealTalk: {reminder.customMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSaveSettings}
          disabled={!isPhoneValid || (enabledReminders.length === 0 && activeConversationReminders.length === 0)}
          className="bg-coral-500 hover:bg-coral-600 text-white px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          Enable SMS Reminders
        </Button>
      </div>
    </div>
  );
};

export default SMSReminder;
