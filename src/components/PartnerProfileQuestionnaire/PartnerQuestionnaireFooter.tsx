
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Heart, Lock, Unlock } from "lucide-react";
import { calculatePartnerOverallProgress, getPartnerTotalCount } from "./PartnerValidationLogic";

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
  validateSection, 
  getRequiredCount, 
  getCompletedCount,
  profileData 
}: PartnerQuestionnaireFooterProps) => {
  const isCurrentSectionValid = validateSection(currentSection);
  const completedCount = getCompletedCount(currentSection);
  const totalCount = getPartnerTotalCount(currentSection);
  const overallProgress = calculatePartnerOverallProgress(profileData);

  const getStatusMessage = () => {
    if (completedCount === totalCount) {
      return "✓ Section Complete";
    }
    const remaining = totalCount - completedCount;
    return remaining > 0 ? 
      `${remaining} more question${remaining === 1 ? '' : 's'} available` : 
      'Complete the available questions';
  };

  const getUnlockPreview = () => {
    if (overallProgress === 100) return null;
    
    return (
      <div className="text-center mt-2 p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Lock className="w-3 h-3 text-orange-400" />
          <span className="text-white/90 font-medium text-xs">Unlock partner insights:</span>
        </div>
        <div className="text-xs text-white/70">
          Dual coaching, relationship dynamics analysis, compatibility insights
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 border-t border-white/15 bg-white/5 backdrop-blur-sm flex-shrink-0">
      <div className="flex justify-between items-start">
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
              {completedCount === totalCount && <Check className="w-3 h-3 text-emerald-300" />}
              <div className={`font-medium text-sm ${completedCount === totalCount ? 'text-emerald-300' : 'text-white/90'}`}>
                {getStatusMessage()}
              </div>
            </div>
          </div>
          {getUnlockPreview()}
        </div>

        <div className="flex gap-2">
          {currentSection < 4 && (
            <Button
              onClick={onNext}
              disabled={!validateSection(currentSection)}
              className="bg-gradient-to-r from-orange-400 via-rose-500 to-pink-600 hover:from-orange-500 hover:via-rose-600 hover:to-pink-700 text-white flex items-center gap-2 px-4 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
            >
              Continue to Unlock
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
              } text-white flex items-center gap-2 px-5 py-2 text-sm rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 font-semibold`}
            >
              {overallProgress === 100 ? (
                <>
                  <Unlock className="w-3 h-3" />
                  Unlock Partner Insights!
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Unlock Partner Features
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireFooter;
