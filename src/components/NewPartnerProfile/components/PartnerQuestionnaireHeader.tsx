import { Button } from "@/components/ui/button";
import { X, User, Heart, Lock, RotateCcw } from "lucide-react";
import { PartnerProfileData } from "../types";
import { refreshAllAppData } from "@/utils/globalRefresh";

interface PartnerQuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: PartnerProfileData;
}

const getInitial = (profileData: PartnerProfileData): string | null => {
  if (profileData.partnerName && profileData.partnerName.trim()) {
    return profileData.partnerName.trim()[0].toUpperCase();
  }
  return null;
};

const PartnerQuestionnaireHeader = ({ overallProgress, onClose, profileData }: PartnerQuestionnaireHeaderProps) => {
  const hasName = profileData.partnerName && profileData.partnerName.trim();
  
  const getProfileTitle = () => {
    if (hasName) {
      return `${profileData.partnerName.trim()}'s Profile`;
    }
    return "Partner Profile";
  };
  
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border-b border-white/[0.06] px-3 py-1.5 sm:px-4 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-md flex items-center justify-center">
            {hasName ? (
              <span className="text-sm sm:text-sm font-bold text-white">{getInitial(profileData)}</span>
            ) : (
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            )}
          </div>
          
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate">{getProfileTitle()}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2 flex-shrink-0">
          <span className="text-sm sm:text-sm text-white/60 font-medium">{overallProgress}%</span>
          <button
            onClick={() => refreshAllAppData()}
            className="text-white/60 hover:text-white w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation"
            aria-label="Refresh profile"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white w-6 h-6 sm:w-6 sm:h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors duration-200 touch-manipulation"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      
      {/* Progress bar - larger on desktop/tablet */}
      <div className="w-full h-1 sm:h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;