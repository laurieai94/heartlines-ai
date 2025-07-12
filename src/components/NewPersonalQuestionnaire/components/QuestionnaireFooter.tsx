
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
  return (
    <div className="p-2 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentSection === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
      >
        Back
      </Button>

      <div className="text-center flex-1 mx-6">
        <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 max-w-md mx-auto">
          <div className="text-sm text-white/90 font-medium">
            Section {currentSection} of 4
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {currentSection < 4 && (
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Next
          </Button>
        )}
        {currentSection === 4 && (
          <Button
            onClick={onComplete}
            disabled={!canComplete}
            className={`${
              overallProgress === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                : 'bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700'
            } text-white flex items-center gap-2 px-5 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-semibold`}
          >
            <Heart className="w-3 h-3" />
            Complete Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
