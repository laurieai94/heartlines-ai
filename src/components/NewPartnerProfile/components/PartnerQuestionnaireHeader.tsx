import { Heart, X } from "lucide-react";
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
    if (overallProgress === 100) return "For deeper insights into your dynamic";
    if (overallProgress >= 75) return "Complete to access all features";
    return "For deeper insights into your dynamic";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            {initial ? (
              <span className="text-xs font-semibold text-white">{initial}</span>
            ) : (
              <Heart className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-white">Partner Profile</h2>
            <p className="text-sm text-white/70">{getSubtitle()}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all duration-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Prominent Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">Progress</span>
          <span className="text-white font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
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