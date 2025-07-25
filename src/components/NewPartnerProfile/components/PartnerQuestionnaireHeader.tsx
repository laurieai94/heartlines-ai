import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles } from "lucide-react";
import { calculatePartnerOverallProgress } from "../utils/partnerProgress";
import { PartnerProfileData } from "../types";

interface PartnerQuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  profileData: PartnerProfileData;
}

const PartnerQuestionnaireHeader = ({ onClose, currentSection, totalSections, profileData }: PartnerQuestionnaireHeaderProps) => {
  const overallProgress = calculatePartnerOverallProgress(profileData);
  
  const getSubtitle = () => {
    if (overallProgress === 100) return "Ready to unlock dual insights";
    if (overallProgress >= 75) return "Complete to access partner features";
    return "For deeper insights into your dynamic";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
            {overallProgress === 100 ? (
              <Heart className="w-4 h-4 text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white">Partner Profile</h2>
            <p className="text-sm text-white/70">{getSubtitle()}</p>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Prominent Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Progress</span>
          <span className="text-white font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
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