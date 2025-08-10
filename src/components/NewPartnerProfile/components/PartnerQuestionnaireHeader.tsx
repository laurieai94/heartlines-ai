import { Heart, X, Lock } from "lucide-react";
import BrandLogo from "../../BrandLogo";
import { Button } from "@/components/ui/button";
import { PartnerProfileData } from "../types";

interface PartnerQuestionnaireHeaderProps {
  overallProgress: number;
  onClose: () => void;
  profileData: PartnerProfileData;
}

const getInitial = (profileData: PartnerProfileData): string | null => {
  return profileData.partnerName ? profileData.partnerName.charAt(0).toUpperCase() : null;
};

const PartnerQuestionnaireHeader = ({ 
  overallProgress, 
  onClose, 
  profileData 
}: PartnerQuestionnaireHeaderProps) => {
  const initial = getInitial(profileData);

  const getSubtitle = () => {
    if (overallProgress === 100) return "Profile completed";
    if (overallProgress > 0) return `${overallProgress}% complete`;
    return "For deeper insights into your dynamic";
  };

  return (
    <div className="relative bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-sm border-b border-white/15 p-3 flex-shrink-0 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
            {initial ? (
              <span className="text-sm font-bold text-white">{initial}</span>
            ) : (
              <BrandLogo 
                className="w-6 h-6" 
                variant="bare" 
                imgSrc="/lovable-uploads/1667f188-8aea-4c45-a20f-aee6014317f6.png"
                imgAlt="RealTalk logo"
              />
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-white">Partner Profile</h2>
            <p className="text-xs text-white/70">{getSubtitle()}</p>
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
      {overallProgress > 0 && overallProgress < 100 && (
        <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default PartnerQuestionnaireHeader;