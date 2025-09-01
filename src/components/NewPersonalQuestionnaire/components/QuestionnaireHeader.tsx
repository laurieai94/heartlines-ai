
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
    <div className="bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.06] px-2.5 py-1.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-md flex items-center justify-center">
            {hasName ? (
              <span className="text-xs font-bold text-white">{getInitial()}</span>
            ) : (
              <Heart className="w-2.5 h-2.5 text-white" />
            )}
          </div>
          
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">Your Profile</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-xs text-white/60 font-medium">{overallProgress}%</span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white w-5 h-5 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Ultra-minimal progress bar */}
      <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
