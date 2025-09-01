
import { Button } from "@/components/ui/button";
import { X, User, Heart, Lock } from "lucide-react";
import { ProfileData } from "../types";

interface QuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: ProfileData;
}

const QuestionnaireHeader = ({ overallProgress, onClose, profileData }: QuestionnaireHeaderProps) => {
  const getInitial = () => {
    if (profileData.name && profileData.name.trim()) {
      return profileData.name.trim()[0].toUpperCase();
    }
    return null;
  };

  const hasName = profileData.name && profileData.name.trim();
  
  return (
    <div className="bg-white/8 backdrop-blur-sm border-b border-white/15 px-4 pt-safe pt-8 pb-4 sm:px-4 sm:py-3 flex-shrink-0 relative z-10">
      <div className="flex items-center justify-between">
        {/* Profile section */}
        <div className="flex items-center gap-3 sm:gap-2">
          {/* Profile initial or icon */}
          <div className="w-9 h-9 sm:w-7 sm:h-7 bg-white/15 rounded-full flex items-center justify-center ring-1 ring-white/20">
            {hasName ? (
              <span className="text-white font-semibold text-base sm:text-xs">
                {getInitial()}
              </span>
            ) : (
              <Heart className="w-5 h-5 sm:w-3 sm:h-3 text-white" />
            )}
          </div>
          
          {/* Title and progress text */}
          <div>
            <h2 className="text-white font-semibold text-base sm:text-base leading-tight">
              Your Profile
            </h2>
            {overallProgress > 0 && overallProgress < 100 && (
              <p className="text-white/80 text-sm sm:text-xs font-medium">{overallProgress}% complete</p>
            )}
            {overallProgress === 100 && (
              <p className="text-sm sm:text-xs text-emerald-400 font-medium">Complete! Ready to start</p>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="flex items-center gap-2 sm:gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Private</span>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors duration-200 touch-manipulation"
            aria-label="Close questionnaire"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 sm:mt-2">
        <div className="w-full bg-white/10 rounded-full h-2 sm:h-1 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ 
              width: `${Math.max(overallProgress, 5)}%`,
              minWidth: overallProgress > 0 ? '8px' : '0px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
