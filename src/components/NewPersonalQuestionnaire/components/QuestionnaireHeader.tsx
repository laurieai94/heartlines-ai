
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
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex-shrink-0 relative">
      <div className="flex items-center justify-between">
        {/* Profile section */}
        <div className="flex items-center gap-2">
          {/* Profile initial or icon */}
          <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
            {hasName ? (
              <span className="text-white font-medium text-xs">
                {getInitial()}
              </span>
            ) : (
              <Heart className="w-3 h-3 text-white" />
            )}
          </div>
          
          {/* Title and progress text */}
          <div>
            <h2 className="text-white font-medium text-base leading-tight">
              Your Profile
            </h2>
            {overallProgress > 0 && overallProgress < 100 && (
              <p className="text-white/70 text-xs">{overallProgress}% complete</p>
            )}
            {overallProgress === 100 && (
              <p className="text-xs text-emerald-400">Complete! Ready to start</p>
            )}
          </div>
        </div>

        {/* Close button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-white/70">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Private</span>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
            aria-label="Close questionnaire"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2">
        <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
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
