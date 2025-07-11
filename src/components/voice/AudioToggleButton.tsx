import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface AudioToggleButtonProps {
  audioEnabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const AudioToggleButton = ({ audioEnabled, onToggle, disabled }: AudioToggleButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      disabled={disabled}
      className={`w-12 h-12 rounded-2xl transition-all duration-300 ${
        audioEnabled 
          ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' 
          : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
      }`}
    >
      {audioEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </Button>
  );
};