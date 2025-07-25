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

  return (
    <div className="p-6 border-b border-white/15 bg-white/5 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/20 to-pink-600/20 backdrop-blur-sm border border-rose-400/30 flex items-center justify-center">
            {initial ? (
              <span className="text-lg font-semibold text-rose-200">{initial}</span>
            ) : (
              <Heart className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Partner Profile</h1>
            <p className="text-white/70 text-sm">For deeper insights into your dynamic</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-105 group"
        >
          <X className="w-5 h-5 text-white/70 group-hover:text-white" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Progress</span>
          <span className="text-white/90 font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;