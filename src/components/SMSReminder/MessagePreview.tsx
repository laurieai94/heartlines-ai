
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ReminderType } from "./types";

interface MessagePreviewProps {
  enabledReminders: ReminderType[];
  showPreview: boolean;
  onTogglePreview: () => void;
}

const MessagePreview = ({ enabledReminders, showPreview, onTogglePreview }: MessagePreviewProps) => {
  if (enabledReminders.length === 0) return null;

  return (
    <Card className="p-6 bg-white/60 backdrop-blur-md border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Message Preview</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
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
  );
};

export default MessagePreview;
