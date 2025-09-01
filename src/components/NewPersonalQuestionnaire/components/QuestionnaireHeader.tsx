
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
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-3 pt-safe pt-2.5 pb-1.5 sm:px-4 sm:py-3 flex-shrink-0 relative z-10">
      <div className="flex items-center justify-between">
        {/* Profile section */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Profile initial or icon */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/10 rounded-full flex items-center justify-center">
            {hasName ? (
              <span className="text-white font-medium text-xs">
                {getInitial()}
              </span>
            ) : (
              <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            )}
          </div>
          
          {/* Title and progress text */}
          <div>
            <h2 className="text-white font-medium text-xs sm:text-base leading-tight">
              Your Profile
            </h2>
            {overallProgress > 0 && overallProgress < 100 && (
              <p className="text-white/70 text-[11px] sm:text-xs">{overallProgress}% complete</p>
            )}
            {overallProgress === 100 && (
              <p className="text-[11px] sm:text-xs text-emerald-400">Complete! Ready to start</p>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Private</span>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            aria-label="Close questionnaire"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-1 sm:mt-2">
        <div className="w-full bg-white/5 rounded-full h-0.5 sm:h-1 overflow-hidden">
          <div 
            className="h-full bg-white/40 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.max(overallProgress, 5)}%`,
              minWidth: overallProgress > 0 ? '4px' : '0px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
