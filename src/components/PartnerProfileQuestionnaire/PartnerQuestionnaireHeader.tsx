
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles, Lock, Unlock } from "lucide-react";
import { calculatePartnerOverallProgress } from "./PartnerValidationLogic";

interface PartnerQuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  profileData: any;
}

const PartnerQuestionnaireHeader = ({ onClose, currentSection, totalSections, profileData }: PartnerQuestionnaireHeaderProps) => {
  const overallProgress = calculatePartnerOverallProgress(profileData);
  
  const getSubtitle = () => {
    if (overallProgress === 100) return "🎉 Partner insights unlocked! Dual coaching ready";
    if (overallProgress >= 75) return "Almost there! Complete to unlock partner features";
    return "Complete to unlock advanced partner coaching insights";
  };

  const getUnlockMessage = () => {
    if (overallProgress === 100) return null;
    return (
      <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
        <Lock className="w-3 h-3" />
        <span>Partner insights locked until profile complete</span>
      </div>
    );
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-1.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            {overallProgress === 100 ? (
              <Unlock className="w-2 h-2 text-white" />
            ) : (
              <Lock className="w-2 h-2 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-xs font-bold text-white">Partner Profile</h2>
            <p className="text-xs text-white/70">{getSubtitle()}</p>
            {getUnlockMessage()}
          </div>
        </div>
        
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">
            {overallProgress === 100 ? "🔓 Partner Insights Unlocked!" : "🔒 Progress to unlock insights"}
          </span>
          <span className="text-white font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 rounded-full ${
              overallProgress === 100 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                : 'bg-gradient-to-r from-orange-400 to-pink-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;
