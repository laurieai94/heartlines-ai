
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import { calculateOverallProgress } from "./ValidationLogic";

interface QuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  profileData: any;
}

const QuestionnaireHeader = ({ onClose, currentSection, totalSections, profileData }: QuestionnaireHeaderProps) => {
  const overallProgress = calculateOverallProgress(profileData);
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Your Personal Profile</h2>
            <p className="text-xs text-white/70">Building your foundation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-32 bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs text-white/90 font-medium min-w-[3rem]">
              {overallProgress}%
            </span>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
