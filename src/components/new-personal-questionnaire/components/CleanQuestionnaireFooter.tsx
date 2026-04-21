import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import { getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount, areRequiredFieldsComplete } from "../utils/requirements";
import { Heart, UserPlus, ArrowLeft, ArrowRight } from "lucide-react";
import { BRAND } from "@/branding";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
interface CleanQuestionnaireFooterProps {
  profileData: ProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
  currentSection?: number;
  onPreviousSection?: () => void;
  onNextSection?: () => void;
}
const CleanQuestionnaireFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false,
  currentSection = 1,
  onPreviousSection,
  onNextSection
}: CleanQuestionnaireFooterProps) => {
  const {
    goToPartner
  } = useNavigation();
  const overallProgress = calculateProgress(profileData);

  // Listen for profile updates to recalculate validation in real-time
  const [validationKey, setValidationKey] = useState(0);

  useEffect(() => {
    const handleProfileUpdate = () => {
      // Force re-validation by triggering state change
      setValidationKey(prev => prev + 1);
    };
    
    window.addEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile:requiredFieldUpdated', handleProfileUpdate);
    };
  }, []);

  // Explicit check for critical required fields
  const hasValidName = profileData.name && profileData.name.trim() !== '';
  const hasValidPronouns = profileData.pronouns && profileData.pronouns.trim() !== '';

  // Section completion status
  const sectionCompletions = [{
    name: "the basics",
    isComplete: validateSection(1, profileData)
  }, {
    name: "your situationship",
    isComplete: validateSection(2, profileData)
  }, {
    name: "how you operate",
    isComplete: validateSection(3, profileData)
  }, {
    name: "your foundation",
    isComplete: validateSection(4, profileData)
  }];

  // Show unlock coaching after 5 required questions are answered
  const canUnlockCoaching = hasValidName &&
                           hasValidPronouns &&
                           areRequiredFieldsComplete(1, profileData) && 
                           areRequiredFieldsComplete(2, profileData) && 
                           areRequiredFieldsComplete(3, profileData) && 
                           areRequiredFieldsComplete(4, profileData);

  // Enable +your person button when all requirements are met
  const canComplete = canUnlockCoaching;

  // Section navigation logic - force fresh validation on every render when required fields change
  const isCurrentSectionValid = useMemo(() => {
    return validateSection(currentSection, profileData);
  }, [currentSection, profileData, validationKey]);
  
  const canGoNext = currentSection < 4 && isCurrentSectionValid;
  const canGoPrevious = currentSection > 1;
  const completedSections = sectionCompletions.filter(s => s.isComplete).length;
  return <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 px-3 py-3 sm:py-3 pb-safe flex-shrink-0">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Left side - Section Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Section Button */}
          <Button variant="outline" onClick={onPreviousSection} disabled={!canGoPrevious} className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:hover:scale-100 text-white">
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">previous</span>
          </Button>

          {/* Section Progress Indicators */}
          <div className="flex gap-1.5 sm:gap-2 mx-2 sm:mx-4">
            {sectionCompletions.map((section, index) => <div key={index} className="flex items-center gap-1 sm:gap-1.5">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${section.isComplete ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' : currentSection === index + 1 ? 'bg-white/60' : 'bg-white/20'}`} />
                {/* Hide labels on mobile, show on tablet+ */}
                <span className={`hidden md:block text-xs font-medium transition-colors duration-300 ${section.isComplete ? 'text-emerald-400' : currentSection === index + 1 ? 'text-white/80' : 'text-white/50'}`}>
                </span>
              </div>)}
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Always show +Your Person button, muted until requirements met */}
          {!autoCompleteEnabled && (
            <Button 
              variant="outline" 
              onClick={goToPartner} 
              disabled={!canComplete}
              className={`${
                canComplete 
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white/80 hover:text-white' 
                  : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              } backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg shadow-sm hover:scale-105 transition-all duration-200 font-medium disabled:hover:scale-100`}
            >
              <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">your person</span>
            </Button>
          )}

          {/* Show Unlock Coaching button only when all 5 required questions are answered */}
          {canUnlockCoaching && !autoCompleteEnabled && (
            <Button onClick={onComplete} className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border-emerald-400/30 hover:border-emerald-400/50 text-emerald-400 hover:scale-[1.02] ring-1 ring-emerald-400/20 backdrop-blur-md border px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl font-semibold shadow-sm transition-[transform,opacity,background-color,border-color] duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm animate-emerald-soft-glow">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">unlock coaching</span>
              <span className="sm:hidden">start</span>
            </Button>
          )}

          {/* Next Section Button (when not on last section and coaching not unlocked yet) */}
          {currentSection < 4 && !canUnlockCoaching && <Button onClick={onNextSection} disabled={!canGoNext} className={`bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-[transform,opacity,background-color] duration-200 disabled:opacity-30 disabled:hover:scale-100 ${canGoNext ? 'animate-soft-pulse-glow' : ''}`}>
              <span className="hidden sm:inline">next</span>
              <span className="sm:hidden">next</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>}

          {/* Show both Next and Unlock buttons when on early sections but requirements are met */}
          {currentSection < 4 && canUnlockCoaching && <Button onClick={onNextSection} disabled={!canGoNext} className={`bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-[transform,opacity,background-color] duration-200 disabled:opacity-30 disabled:hover:scale-100 font-medium ${canGoNext ? 'animate-soft-pulse-glow' : ''}`}>
              <span className="hidden sm:inline">next</span>
              <span className="sm:hidden">next</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>}

          {/* Auto-completion message */}
          {autoCompleteEnabled && <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-400 text-xs sm:text-sm font-medium animate-pulse">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">profile complete! unlocking {BRAND.name}...</span>
              <span className="sm:hidden">complete!</span>
            </div>}
        </div>
      </div>
    </div>;
};
export default CleanQuestionnaireFooter;