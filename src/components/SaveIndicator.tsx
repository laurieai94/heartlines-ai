import { Check, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SaveIndicatorProps {
  isSyncing: boolean;
  lastSaved?: Date | null;
  className?: string;
}

const SaveIndicator = ({ isSyncing, lastSaved, className = "" }: SaveIndicatorProps) => {
  if (isSyncing) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-white/60 ${className}`}>
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-green-400/80 ${className}`}>
        <Check className="w-3 h-3" />
        <span>saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
      </div>
    );
  }

  return null;
};

export default SaveIndicator;
