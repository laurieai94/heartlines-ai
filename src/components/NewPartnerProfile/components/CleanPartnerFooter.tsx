import { PartnerProfileData } from "../types";
import { calculatePartnerProgress, validatePartnerSection } from "../utils/partnerValidation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

interface CleanPartnerFooterProps {
  profileData: PartnerProfileData;
  onComplete: (skipPopup?: boolean) => void;
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
    onComplete(true); // Pass true to skip popup
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 px-4 py-2.5 flex-shrink-0">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Left side - Section Progress Indicators */}
        <div className="flex gap-4">
          {[
            { section: 1, name: "The Basics" },
            { section: 2, name: "How They Operate" },
            { section: 3, name: "Their Foundation" }
          ].map(({ section, name }) => {
            const isComplete = validatePartnerSection(section, profileData);
            return (
              <div key={section} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isComplete 
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' 
                    : 'bg-white/20'
                }`} />
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isComplete ? 'text-emerald-400' : 'text-white/60'
                }`}>
                  {name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right side - Unlock button */}
        <div className="flex items-center">
          <button 
            onClick={handleUnlockCoaching}
            className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border-emerald-400/30 hover:border-emerald-400/50 text-emerald-400 hover:scale-[1.02] animate-soft-glow ring-1 ring-emerald-400/20 backdrop-blur-md border px-6 py-2 rounded-xl font-semibold shadow-sm transition-all duration-300 flex items-center gap-2 text-sm motion-reduce:animate-none"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Unlock coaching</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CleanPartnerFooter;