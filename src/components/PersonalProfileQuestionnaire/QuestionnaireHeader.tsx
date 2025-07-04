
import { Button } from "@/components/ui/button";
import { X, Sparkles, Trophy } from "lucide-react";
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
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-electric-blue to-electric-purple rounded-lg flex items-center justify-center shadow-lg">
            {overallProgress === 100 ? (
              <Trophy className="w-3 h-3 text-white" />
            ) : (
              <Sparkles className="w-3 h-3 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Your Profile</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <span className="text-xs text-white/60 font-medium">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
