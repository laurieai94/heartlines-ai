
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles } from "lucide-react";
import { calculateOverallProgress } from "./ValidationLogic";

interface QuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  profileData: any;
}

const QuestionnaireHeader = ({ onClose, currentSection, totalSections, profileData }: QuestionnaireHeaderProps) => {
  const overallProgress = calculateOverallProgress(profileData);
  
  const getSubtitle = () => {
    if (overallProgress === 100) return "Personalized for your messy reality";
    if (overallProgress >= 75) return "Complete to access all features";
    return "Personalized for your messy reality";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2.5 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            {overallProgress === 100 ? (
              <Heart className="w-3 h-3 text-white" />
            ) : (
              <Sparkles className="w-3 h-3 text-white" />
            )}
          </div>
          
          <div>
            <h2 className="text-base font-bold text-white">Your Profile</h2>
            <p className="text-xs text-white/70">{getSubtitle()}</p>
          </div>
        </div>
        
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Prominent Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/70">Progress</span>
          <span className="text-white font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
