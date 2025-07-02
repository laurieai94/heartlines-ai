
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Sparkles } from "lucide-react";

interface QuestionnaireHeaderProps {
  onClose: () => void;
  currentSection: number;
  totalSections: number;
}

const QuestionnaireHeader = ({ onClose, currentSection, totalSections }: QuestionnaireHeaderProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/15 p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Your Personal Profile</h2>
            <p className="text-xs text-white/70">Building your foundation</p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentSection / totalSections) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireHeader;
