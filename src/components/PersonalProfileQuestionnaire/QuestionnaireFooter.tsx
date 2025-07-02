
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

interface QuestionnaireFooterProps {
  currentSection: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
}

const QuestionnaireFooter = ({ 
  currentSection, 
  onBack, 
  onNext, 
  onComplete, 
  validateSection, 
  getRequiredCount, 
  getCompletedCount 
}: QuestionnaireFooterProps) => {
  const isCurrentSectionComplete = validateSection(currentSection);
  const completedCount = getCompletedCount(currentSection);
  const requiredCount = getRequiredCount(currentSection);

  return (
    <div className="p-4 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentSection === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="text-center">
        <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/90 font-medium border border-white/15 mb-1">
          {completedCount}/{requiredCount} answered
        </div>
        <div className="text-xs text-white/70">
          {currentSection === 4 ? 'Complete to unlock RealTalk' : `${4 - currentSection} steps remaining`}
        </div>
      </div>

      <div className="flex gap-2">
        {currentSection < 4 && (
          <Button
            onClick={onNext}
            disabled={!isCurrentSectionComplete}
            className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        {currentSection === 4 && (
          <Button
            onClick={onComplete}
            disabled={!isCurrentSectionComplete}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Sparkles className="w-4 h-4" />
            Start RealTalk!
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
