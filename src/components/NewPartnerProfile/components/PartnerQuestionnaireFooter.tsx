import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { calculatePartnerOverallProgress } from "../utils/partnerProgress";
import { getPartnerTotalCount } from "../utils/partnerValidation";
import { PartnerProfileData } from "../types";

interface PartnerQuestionnaireFooterProps {
  currentSection: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  validateSection: (section: number) => boolean;
  getRequiredCount: (section: number) => number;
  getCompletedCount: (section: number) => number;
  profileData: PartnerProfileData;
}

const PartnerQuestionnaireFooter = ({ 
  currentSection, 
  onBack, 
  onNext, 
  onComplete, 
  validateSection,
  getRequiredCount,
  getCompletedCount,
  profileData 
}: PartnerQuestionnaireFooterProps) => {
  
  const getStatusMessage = () => {
    const completed = getCompletedCount(currentSection);
    const required = getRequiredCount(currentSection);
    const total = getPartnerTotalCount(currentSection);
    const optional = total - required;
    
    if (currentSection === 1) {
      if (completed >= required) {
        return `Requirements met! ${completed - required}/${optional} optional questions completed`;
      } else {
        return `${required - completed} required ${required - completed === 1 ? 'field' : 'fields'} remaining`;
      }
    } else {
      return `${completed}/${total} questions completed (all optional)`;
    }
  };

  const overallProgress = calculatePartnerOverallProgress(profileData);
  const canComplete = profileData.partnerName?.trim() && profileData.partnerPronouns?.trim();

  return (
    <div className="bg-white/5 backdrop-blur-sm border-t border-white/15 p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={currentSection === 1}
          className="text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center px-4">
          <p className="text-xs text-white/70 mb-1">
            {getStatusMessage()}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>Section {currentSection} of 3</span>
            <span>•</span>
            <span>{overallProgress}% overall</span>
          </div>
        </div>

        {currentSection < 3 ? (
          <Button
            onClick={onNext}
            disabled={currentSection === 1 && !validateSection(1)}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 disabled:opacity-40"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            disabled={!canComplete}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Complete & Unlock Features
          </Button>
        )}
      </div>
    </div>
  );
};

export default PartnerQuestionnaireFooter;