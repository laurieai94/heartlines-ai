import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceRecordingButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const VoiceRecordingButton = ({ isRecording, onClick, disabled }: VoiceRecordingButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
        isRecording 
          ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100 animate-pulse' 
          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
      }`}
    >
      {isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};