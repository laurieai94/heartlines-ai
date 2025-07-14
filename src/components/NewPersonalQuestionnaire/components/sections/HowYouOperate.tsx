
import { Zap } from "lucide-react";
import { ProfileData } from "../../types";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";
import StressResponseQuestion from "./HowYouOperate/StressResponseQuestion";
import LoveLanguageQuestion from "./HowYouOperate/LoveLanguageQuestion";
import ConflictStyleQuestion from "./HowYouOperate/ConflictStyleQuestion";

interface HowYouOperateProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onAutoScroll?: (questionId: string) => void;
  onSectionComplete?: () => void;
}

const HowYouOperate = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onAutoScroll,
  onSectionComplete
}: HowYouOperateProps) => {
  // Section completion check
  const isSectionComplete = validateSection(3, profileData);

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">How You Operate</h3>
      </div>

      <StressResponseQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        onContinue={() => onAutoScroll?.('question-love-language')}
      />

      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        onContinue={() => onAutoScroll?.('question-conflict-style')}
      />

      <ConflictStyleQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
        onContinue={() => {
          // This is the last question in the section
          if (isSectionComplete) {
            onSectionComplete?.();
          }
        }}
      />

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={3}
        onClick={() => {
          // Scroll to first question of next section
          setTimeout(() => {
            const nextSectionFirstQuestion = document.querySelector('[data-section="4"] [data-question-card]');
            if (nextSectionFirstQuestion) {
              nextSectionFirstQuestion.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }, 100);
          onSectionComplete?.();
        }}
      />
    </div>
  );
};

export default HowYouOperate;
