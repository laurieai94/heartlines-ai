
import { ProfileData } from "../types";
import { validateSection, calculateProgress } from "../utils/validation";
import { Heart } from "lucide-react";
import { BRAND } from "@/branding";

interface CleanQuestionnaireFooterProps {
  profileData: ProfileData;
  onComplete: () => void;
  autoCompleteEnabled?: boolean;
}

const CleanQuestionnaireFooter = ({
  profileData,
  onComplete,
  autoCompleteEnabled = false
}: CleanQuestionnaireFooterProps) => {
  const overallProgress = calculateProgress(profileData);
  
  // Section completion status
  const sectionCompletions = [{
    name: "The Basics",
    isComplete: validateSection(1, profileData)
  }, {
    name: "Your Situationship",
    isComplete: validateSection(2, profileData)
  }, {
    name: "How You Operate",
    isComplete: validateSection(3, profileData)
  }, {
    name: "Your Foundation",
    isComplete: validateSection(4, profileData)
  }];

  // Enable button when all required sections are complete (not 100% progress)
  const canComplete = sectionCompletions.every(section => section.isComplete);

  const completedSections = sectionCompletions.filter(s => s.isComplete).length;

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 px-3 py-3 pb-8 pb-safe flex-shrink-0">
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        {/* Left side - Section Progress Indicators */}
        <div className="flex gap-2 sm:gap-4">
          {sectionCompletions.map((section, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2">
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                section.isComplete 
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-400/30' 
                  : 'bg-white/20'
              }`} />
              {/* Hide labels on mobile, show on tablet+ */}
              <span className={`hidden sm:block text-xs font-medium transition-colors duration-300 ${
                section.isComplete ? 'text-emerald-400' : 'text-white/60'
              }`}>
                {section.name}
              </span>
            </div>
          ))}
        </div>

        {/* Right side - Unlock Coaching Button */}
        <div className="flex items-center">
          {!autoCompleteEnabled && (
            <button 
              onClick={canComplete ? onComplete : undefined}
              disabled={!canComplete}
              className={`${
                canComplete 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 border-emerald-400/30 hover:border-emerald-400/50 text-emerald-400 hover:scale-[1.02] animate-soft-glow ring-1 ring-emerald-400/20' 
                  : 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
              } backdrop-blur-md border px-3 py-1.5 sm:px-6 sm:py-2 rounded-lg sm:rounded-xl font-semibold shadow-sm transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm motion-reduce:animate-none`}
            >
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Unlock coaching</span>
              <span className="sm:hidden">Start</span>
            </button>
          )}
          
          {/* Auto-completion message */}
          {autoCompleteEnabled && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-400 text-xs sm:text-sm font-medium animate-pulse">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Profile Complete! Unlocking {BRAND.name}...</span>
              <span className="sm:hidden">Complete!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanQuestionnaireFooter;
