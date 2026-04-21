
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface QuestionnaireFooterProps {
  currentSection: number;
  overallProgress: number;
  canComplete: boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

const QuestionnaireFooter = ({
  currentSection,
  overallProgress,
  canComplete,
  onBack,
  onNext,
  onComplete
}: QuestionnaireFooterProps) => {
  // Only show footer when all sections are complete
  if (overallProgress < 100) {
    return null;
  }

  const handleComplete = () => {
    console.log('[QuestionnaireFooter] Complete button clicked, setting completion flag');
    sessionStorage.setItem('questionnaire-completing', 'true');
    onComplete();
  };

  return (
    <div className="p-6 pb-10 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-center items-center flex-shrink-0">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 flex items-center justify-center">
            <Heart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-medium text-white/90">
            All sections complete!
          </div>
        </div>
        
        <Button
          onClick={handleComplete}
          disabled={!canComplete}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-3 px-8 py-3 text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 font-semibold"
        >
          <Heart className="w-4 h-4" />
          unlock kai ai coach
        </Button>
        
        <p className="text-white/70 text-sm max-w-md">
          you're ready to start your personalized relationship coaching journey with kai!
        </p>
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
