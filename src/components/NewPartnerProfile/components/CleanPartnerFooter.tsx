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
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-3 flex-shrink-0">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Left side - Progress dots with section names */}
        <div className="flex items-center gap-4">
          {[
            { section: 1, name: "The Basics" },
            { section: 2, name: "How They Operate" },
            { section: 3, name: "Their Foundation" }
          ].map(({ section, name }) => {
            const isComplete = validatePartnerSection(section, profileData);
            return (
              <div key={section} className="flex flex-col items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    isComplete 
                      ? 'bg-emerald-400 shadow-sm' 
                      : 'border border-white/30 bg-transparent'
                  }`}
                />
                <span className="text-white/60 text-[10px] font-medium">{name}</span>
              </div>
            );
          })}
        </div>

        {/* Right side - Unlock button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleUnlockCoaching}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            <Heart className="w-4 h-4" />
            Unlock coaching
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CleanPartnerFooter;