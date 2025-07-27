import { PartnerProfileData } from "../types";
import { calculatePartnerProgress } from "../utils/partnerValidation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

interface CleanPartnerFooterProps {
  profileData: PartnerProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
}

const CleanPartnerFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false
}: CleanPartnerFooterProps) => {
  const overallProgress = calculatePartnerProgress(profileData);
  const { goToCoach } = useNavigation();

  const handleUnlockCoaching = () => {
    onComplete();
    goToCoach();
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-4 flex-shrink-0">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Left side - Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">
              AI coach Kai is ready ({overallProgress}% complete)
            </span>
          </div>
        </div>

        {/* Right side - Unlock button */}
        <div className="flex items-center gap-3">
          {!autoCompleteEnabled ? (
            <Button
              onClick={handleUnlockCoaching}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <Heart className="w-4 h-4" />
              Unlock coaching
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-400 text-sm font-medium animate-pulse">
              <Heart className="w-4 h-4" />
              <span>Unlocking coaching...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanPartnerFooter;