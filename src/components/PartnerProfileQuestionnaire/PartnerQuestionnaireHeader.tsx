
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles } from "lucide-react";
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
    if (overallProgress === 100) return "Ready to unlock dual insights";
    if (overallProgress >= 75) return "Complete to access partner features";
    return "Building your partner's profile";
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border-b border-white/15 p-3 flex-shrink-0 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-bounce-gentle">
            {overallProgress === 100 ? (
              <Heart className="w-3 h-3 text-white" />
            ) : (
              <Sparkles className="w-3 h-3 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Partner Profile</h2>
            <p className="text-xs text-white/80 font-medium">{getSubtitle()}</p>
          </div>
        </div>
        
        <Button 
          variant="glassy" 
          size="xs"
          onClick={onClose} 
          className="text-white/80 hover:text-white hover:bg-white/15 p-1.5 rounded-full transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/80 font-medium">Overall Progress</span>
          <span className="text-white font-semibold text-sm">{overallProgress}%</span>
        </div>
        <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 transition-all duration-1000 ease-out rounded-full shadow-sm"
            style={{ 
              width: `${overallProgress}%`,
              boxShadow: overallProgress > 0 ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireHeader;
