
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Clock } from "lucide-react";
import { ReminderType } from "./types";

interface PresetRemindersProps {
  reminderTypes: ReminderType[];
  onUpdateReminderType: (id: string, updates: Partial<ReminderType>) => void;
}

const PresetReminders = ({ reminderTypes, onUpdateReminderType }: PresetRemindersProps) => {
  return (
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
                  onUpdateReminderType(type.id, { enabled: !!checked })
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
                    onValueChange={(value) => onUpdateReminderType(type.id, { time: value })}
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
                    onChange={(e) => onUpdateReminderType(type.id, { customMessage: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PresetReminders;
