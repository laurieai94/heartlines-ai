
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReminderButtonProps {
  suggestedText: string;
  messageId: number;
}

const ReminderButton = ({ suggestedText, messageId }: ReminderButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reminderText, setReminderText] = useState(suggestedText);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateReminder = async () => {
    if (!user) {
      toast.error('Please sign in to create reminders');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_reminders')
        .insert({
          user_id: user.id,
          reminder_text: reminderText,
          reminder_time: reminderTime,
          created_from_conversation: true,
          conversation_message_id: messageId,
          is_active: true
        });

      if (error) throw error;

      toast.success('Reminder created! You\'ll get a text at the scheduled time.');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    const displayHour = i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i-12}:00 PM`;
    return { value: `${hour}:00`, label: displayHour };
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs bg-gradient-to-r from-coral-50 to-peach-50 border-coral-200 hover:from-coral-100 hover:to-peach-100 text-coral-700"
        >
          <Bell className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
          Set Reminder
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-coral-100">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-coral-500" />
            Set Up Your Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="reminder-text" className="text-sm font-medium text-gray-700">
              Reminder Message
            </Label>
            <Textarea
              id="reminder-text"
              value={reminderText}
              onChange={(e) => setReminderText(e.target.value)}
              placeholder="What should I remind you about?"
              className="mt-1 border-gray-200 focus:border-coral-300 focus:ring-coral-200"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="reminder-time" className="text-sm font-medium text-gray-700">
              Reminder Time
            </Label>
            <Select value={reminderTime} onValueChange={setReminderTime}>
              <SelectTrigger className="mt-1 border-gray-200 focus:border-coral-300">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreateReminder}
              disabled={isLoading || !reminderText.trim()}
              className="flex-1 bg-coral-500 hover:bg-coral-600 text-white"
            >
              {isLoading ? 'Creating...' : 'Create Reminder'}
            </Button>
            <Button
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderButton;
