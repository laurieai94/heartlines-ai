
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Heart, UserPlus } from "lucide-react";
import { calculateOverallProgress } from "./ValidationLogic";
import { BRAND } from "@/branding";
import { useNavigation } from "@/contexts/NavigationContext";

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
  const { goToPartner } = useNavigation();
  const isCurrentSectionValid = validateSection(currentSection);
  const completedCount = getCompletedCount(currentSection);
  const requiredCount = getRequiredCount(currentSection);
  const remainingCount = requiredCount - completedCount;
  const overallProgress = calculateOverallProgress(profileData);
  const canComplete = validateSection(4);

  const getStatusMessage = () => {
    if (isCurrentSectionValid) {
      return "✓ Section Complete";
    }
    return remainingCount > 0 ? 
      `${remainingCount} more question${remainingCount === 1 ? '' : 's'} to go` : 
      'Please complete the required questions';
  };

  return (
    <div className="p-2 pb-6 border-t border-white/15 bg-white/5 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentSection === 1}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-white"
      >
        <ArrowLeft className="w-3 h-3" />
        Back
      </Button>

      <div className="text-center flex-1 mx-6">
        <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2">
            <div className={`font-medium text-sm ${isCurrentSectionValid ? 'text-emerald-300' : 'text-white/90'}`}>
              {getStatusMessage()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {currentSection < 4 && (
          <Button
            onClick={onNext}
            disabled={!validateSection(currentSection)}
            className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            Next Step
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
        {currentSection === 4 && canComplete && (
          <Button
            onClick={goToPartner}
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white/80 hover:text-white backdrop-blur-sm flex items-center gap-2 px-4 py-2 text-sm rounded-lg shadow-sm hover:scale-105 transition-all duration-200 font-medium mr-2"
          >
            <UserPlus className="w-3 h-3" />
            Add your person's details
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
            } text-white flex items-center gap-2 px-5 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-semibold`}
          >
            <Heart className="w-3 h-3" />
            {overallProgress === 100 ? `Start Using ${BRAND.name}!` : `Complete & Unlock ${BRAND.name}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFooter;
