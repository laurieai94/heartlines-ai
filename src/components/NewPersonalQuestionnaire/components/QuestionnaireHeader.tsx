
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
    <div className="bg-white/3 backdrop-blur-sm border-b border-white/10 px-3 py-2 sm:p-1.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            {hasName ? (
              <span className="text-xs sm:text-xs font-bold text-white">{getInitial()}</span>
            ) : (
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Your Profile</h2>
            <p className="text-xs text-white/60 hidden sm:block">
              {overallProgress === 100 ? 'Complete! Ready to start' : `${overallProgress}% complete`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 font-medium">{overallProgress}%</span>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation"
            aria-label="Close questionnaire"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Minimal progress bar for mobile */}
      <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
