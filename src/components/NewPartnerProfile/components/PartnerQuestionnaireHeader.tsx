import { Button } from "@/components/ui/button";
import { X, User, Heart, Lock } from "lucide-react";
import { PartnerProfileData } from "../types";

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
  
  return (
    <div className="bg-white/3 backdrop-blur-sm border-b border-white/10 px-3 py-2 sm:p-1.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            {hasName ? (
              <span className="text-xs sm:text-xs font-bold text-white">{getInitial(profileData)}</span>
            ) : (
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Partner Profile</h2>
            <div className="flex items-center gap-1.5 sm:hidden">
              <div className="flex items-center gap-1 px-1 py-0.5 bg-white/8 rounded-md">
                <Lock className="w-2.5 h-2.5 text-white/60" />
                <span className="text-xs text-white/60 font-medium">Private</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-white/70">
            <Lock className="w-3 h-3" />
            <span className="text-xs">Private</span>
          </div>
          <span className="text-xs text-white/60 font-medium">{overallProgress}%</span>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
      
      {/* Minimal progress bar */}
      <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;