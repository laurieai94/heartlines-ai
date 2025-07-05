
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface PartnerQuestionnaireFooterProps {
  currentSection: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  profileData: any;
}

const PartnerQuestionnaireFooter = ({
  currentSection,
  onBack,
  onNext,
  onComplete,
  getRequiredCount,
  getCompletedCount
}: PartnerQuestionnaireFooterProps) => {
  const isLastSection = currentSection === 4;
  const completedCount = getCompletedCount(currentSection);
  const requiredCount = getRequiredCount(currentSection);

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentSection > 1 && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-white/70">
          {completedCount}/{requiredCount} answered
        </div>

        <div className="flex items-center gap-2">
          {!isLastSection ? (
            <Button 
              onClick={onNext}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={onComplete}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireFooter;
