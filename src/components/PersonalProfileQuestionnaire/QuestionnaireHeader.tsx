
import { Button } from "@/components/ui/button";
import { X, Sparkles, Clock } from "lucide-react";
import { getMotivationalMessage, getTimeEstimation } from "./ValidationLogic";

interface QuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
  overallProgress: number;
}

const QuestionnaireHeader = ({ onClose, currentSection, totalSections, overallProgress }: QuestionnaireHeaderProps) => {
  const motivationalMessage = getMotivationalMessage(overallProgress, currentSection);
  const timeEstimation = getTimeEstimation(overallProgress);

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-2 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Your Personal Profile</h2>
            <p className="text-xs text-white/70">Building your foundation</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full">
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Enhanced Progress Section */}
      <div className="space-y-2">
        {/* Main Progress Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out transform"
              style={{ 
                width: `${overallProgress}%`,
                boxShadow: overallProgress > 0 ? '0 0 8px rgba(249, 115, 22, 0.4)' : 'none'
              }}
            />
          </div>
          <div className="text-xs font-semibold text-white min-w-[45px]">
            {overallProgress}%
          </div>
        </div>

        {/* Motivational Message & Time */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <span>{motivationalMessage}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <Clock className="w-3 h-3" />
            <span>{timeEstimation}</span>
          </div>
        </div>

        {/* Section Progress Indicators */}
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((section) => (
            <div
              key={section}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                section < currentSection 
                  ? 'bg-emerald-500 shadow-sm' 
                  : section === currentSection 
                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 animate-pulse' 
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
