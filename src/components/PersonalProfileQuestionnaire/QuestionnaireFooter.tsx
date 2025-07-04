
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { calculateOverallProgress } from "./ValidationLogic";

interface QuestionnaireFooterProps {
  currentSection: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  profileData: any;
}

const QuestionnaireFooter = ({ 
  currentSection, 
  onBack, 
  onNext, 
  onComplete, 
  validateSection, 
  getRequiredCount, 
  getCompletedCount,
  profileData 
}: QuestionnaireFooterProps) => {
  const isCurrentSectionValid = validateSection(currentSection);
  const completedCount = getCompletedCount(currentSection);
  const requiredCount = getRequiredCount(currentSection);
  const remainingCount = requiredCount - completedCount;
  const overallProgress = calculateOverallProgress(profileData);

  const getStatusMessage = () => {
    if (isCurrentSectionValid) {
      return currentSection === 4 ? 
        `Ready to unlock RealTalk! (${overallProgress}% complete)` : 
        "✓ Section Complete - Ready for next step";
    }
    return remainingCount > 0 ? 
      `Complete ${remainingCount} more required question${remainingCount === 1 ? '' : 's'}` : 
      'Complete all required questions';
  };

  const getCompleteButtonText = () => {
    if (overallProgress === 100) return "Complete Profile & Start Using RealTalk";
    return "Complete Profile & Unlock RealTalk";
  };

  return (
    <div className="p-2 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentSection === 1}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </Button>

      <div className="text-center flex-1 mx-4">
        <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs border border-white/15 max-w-xs mx-auto">
          <div className={`font-medium ${isCurrentSectionValid ? 'text-emerald-300' : 'text-white/90'}`}>
            {getStatusMessage()}
          </div>
          {currentSection === 4 && overallProgress < 100 && (
            <div className="text-white/70 mt-1">
              Complete your profile to access all RealTalk features
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {currentSection < 4 && (
          <Button
            onClick={onNext}
            disabled={!validateSection(currentSection)}
            className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Next Step
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
        {currentSection === 4 && (
          <Button
            onClick={onComplete}
            disabled={!validateSection(4)}
            className={`${
              overallProgress === 100 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                : 'bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700'
            } text-white flex items-center gap-2 px-4 py-1.5 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-semibold`}
          >
            {overallProgress === 100 ? <Check className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            {getCompleteButtonText()}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
