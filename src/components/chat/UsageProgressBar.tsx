import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

interface UsageProgressBarProps {
  messagesUsed: number;
  messageLimit: number;
  usagePercentage: number;
  onUpgrade: () => void;
  tier: string | null;
}

export const UsageProgressBar = ({
  messagesUsed,
  messageLimit,
  usagePercentage,
  onUpgrade,
  tier
}: UsageProgressBarProps) => {
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  
  // Don't show on mobile phones
  if (isMobilePhone) return null;
  
  // Only show at 85% or higher
  if (usagePercentage < 85) return null;
  
  const messagesRemaining = messageLimit - messagesUsed;
  const isNearLimit = usagePercentage >= 85 && usagePercentage < 95;
  const isCritical = usagePercentage >= 95;
  
  return (
    <div className="animate-fade-in mb-3 md:max-w-[54rem] md:mx-auto md:px-12">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        {/* Header with icon and message count */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isCritical ? 'text-coral-400' : 'text-pink-400'}`} />
            <span className="text-sm font-medium text-white/90">
              {messagesRemaining} message{messagesRemaining !== 1 ? 's' : ''} remaining
            </span>
          </div>
          
          <span className="text-xs text-white/60">
            {messagesUsed} / {messageLimit}
          </span>
        </div>
        
        {/* Progress bar */}
        <Progress 
          value={usagePercentage} 
          className="h-2 mb-3"
        />
        
        {/* Call to action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/70">
            {isNearLimit 
              ? "you're getting close to your monthly limit" 
              : "almost at your limit! upgrade to continue chatting"}
          </p>
          
          <Button
            size="sm"
            onClick={onUpgrade}
            className="bg-gradient-to-r from-coral-400 to-pink-500 hover:from-coral-300 hover:to-pink-400 text-white text-xs px-4 py-1.5 h-auto"
          >
            upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};
