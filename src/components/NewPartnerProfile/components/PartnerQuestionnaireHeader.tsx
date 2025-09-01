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
    <div className="bg-white/[0.04] backdrop-blur-md border-b border-white/[0.08] px-3 pt-safe pt-3.5 pb-1.5 sm:py-2 flex-shrink-0 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent"></div>
      
      <div className="flex items-center justify-between relative z-10">
         <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            {hasName ? (
              <span className="text-white font-bold text-xs relative z-10">{getInitial(profileData)}</span>
            ) : (
              <Heart className="w-4 h-4 text-white relative z-10" />
            )}
          </div>
           
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Partner Profile</h2>
            {overallProgress > 0 && overallProgress < 100 && (
              <p className="text-xs text-white/60 font-medium">{overallProgress}% complete</p>
            )}
            {overallProgress === 100 && (
              <p className="text-xs text-emerald-400 font-medium">Complete! Ready to start</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-white/70">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Private</span>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-white/70 hover:text-white hover:bg-white/12 p-2 rounded-full transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Subtle Progress Bar */}
      <div className="mt-1.5 relative z-10">
        <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;