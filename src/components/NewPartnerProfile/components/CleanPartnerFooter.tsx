import { PartnerProfileData } from "../types";
import { calculatePartnerProgress, validatePartnerSection } from "../utils/partnerValidation";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";

interface CleanPartnerFooterProps {
  profileData: PartnerProfileData;
  onComplete: (skipPopup?: boolean) => void;
  autoCompleteEnabled?: boolean;
  currentSection?: number;
  onPreviousSection?: () => void;
  onNextSection?: () => void;
}

const CleanPartnerFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false,
  currentSection = 1,
  onPreviousSection,
  onNextSection
}: CleanPartnerFooterProps) => {
  const overallProgress = calculatePartnerProgress(profileData);
  
  // Section completion status
  const sectionCompletions = [{
    name: "The Basics",
    isComplete: validatePartnerSection(1, profileData)
  }, {
    name: "How They Operate", 
    isComplete: validatePartnerSection(2, profileData)
  }, {
    name: "Their Foundation",
    isComplete: validatePartnerSection(3, profileData)
  }];

  // Enable button when all required sections are complete
  const canComplete = sectionCompletions.every(section => section.isComplete);
  
  // Section navigation logic
  const isCurrentSectionValid = validatePartnerSection(currentSection, profileData);
  const canGoNext = currentSection < 3 && isCurrentSectionValid;
  const canGoPrevious = currentSection > 1;

  const handleUnlockCoaching = () => {
    onComplete(true); // Pass true to skip popup
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 px-3 py-2 sm:py-3 pb-6 sm:pb-8 pb-safe flex-shrink-0">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Left side - Section Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Section Button */}
          <Button
            variant="outline"
            onClick={onPreviousSection}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100 text-white"
          >
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Section Progress Indicators */}
          <div className="flex gap-1.5 sm:gap-2 mx-2 sm:mx-4">
            {sectionCompletions.map((section, index) => (
              <div key={index} className="flex items-center gap-1 sm:gap-1.5">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  section.isComplete 
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' 
                    : currentSection === index + 1
                    ? 'bg-white/60'
                    : 'bg-white/20'
                }`} />
                {/* Hide labels on mobile, show on tablet+ */}
                <span className={`hidden md:block text-xs font-medium transition-colors duration-300 ${
                  section.isComplete 
                    ? 'text-emerald-400' 
                    : currentSection === index + 1
                    ? 'text-white/80'
                    : 'text-white/50'
                }`}>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Show unlock button as soon as all required sections are complete */}
          {canComplete && (
            <Button
              onClick={handleUnlockCoaching}
              className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border-emerald-400/30 hover:border-emerald-400/50 text-emerald-400 hover:scale-[1.02] animate-soft-glow ring-1 ring-emerald-400/20 backdrop-blur-md border px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl font-semibold shadow-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm motion-reduce:animate-none"
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Unlock coaching</span>
              <span className="sm:hidden">Start</span>
            </Button>
          )}

          {/* Next Section Button - always show when not on final section */}
          {currentSection < 3 && (
            <Button
              onClick={onNextSection}
              disabled={!canGoNext}
              className={`bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100 ${
                canGoNext ? 'animate-glow-pulse' : ''
              }`}
            >
              <span className="hidden sm:inline">Next Section</span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanPartnerFooter;