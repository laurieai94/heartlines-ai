
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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
  return (
    <div className="p-3 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentSection === 1}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </Button>

      <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white/90 font-medium border border-white/15">
        {getCompletedCount(currentSection)}/{getRequiredCount(currentSection)} required
      </div>

      <div className="flex gap-2">
        {currentSection < 4 && (
          <Button
            onClick={onNext}
            disabled={!validateSection(currentSection)}
            className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Next
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
        {currentSection === 4 && (
          <Button
            onClick={onComplete}
            disabled={!validateSection(4)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Check className="w-3 h-3" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
