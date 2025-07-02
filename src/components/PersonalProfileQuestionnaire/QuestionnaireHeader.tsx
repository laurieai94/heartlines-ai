
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
  
  const getProgressMessage = () => {
    if (overallProgress === 0) return "Let's get started with your profile";
    if (overallProgress < 25) return "Great start! Keep going";
    if (overallProgress < 50) return "You're making progress";
    if (overallProgress < 75) return "Almost halfway there";
    if (overallProgress < 100) return "You're almost done!";
    return "Profile complete! Ready for RealTalk";
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your Personal Profile</h2>
            <p className="text-sm text-white/80">{getProgressMessage()}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-white/90">
          <span className="font-medium">Step {currentSection} of {totalSections}</span>
          <span className="font-bold">{overallProgress}% Complete</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="text-xs text-white/70 text-center">
          Complete all 4 steps to unlock RealTalk's personalized coaching
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
