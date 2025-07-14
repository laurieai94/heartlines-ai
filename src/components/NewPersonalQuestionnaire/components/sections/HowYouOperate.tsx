
import { Zap } from "lucide-react";
import { ProfileData } from "../../types";
import { validateSection } from "../../utils/validation";
import StressResponseQuestion from "./HowYouOperate/StressResponseQuestion";
import LoveLanguageQuestion from "./HowYouOperate/LoveLanguageQuestion";
import ConflictStyleQuestion from "./HowYouOperate/ConflictStyleQuestion";
import ContinueButton from "../shared/ContinueButton";

interface HowYouOperateProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const HowYouOperate = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onSectionComplete
}: HowYouOperateProps) => {
  const isSectionComplete = validateSection(3, profileData);

  const scrollToNextQuestion = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-section="4"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onSectionComplete?.();
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`} data-section="3">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">How You Operate</h3>
      </div>

      <StressResponseQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />
      {profileData.stressResponse?.length > 0 && (
        <ContinueButton onClick={() => scrollToNextQuestion('question-love-language')} />
      )}

      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />
      {profileData.loveLanguage?.length > 0 && (
        <ContinueButton onClick={() => scrollToNextQuestion('question-conflict-style')} />
      )}

      <ConflictStyleQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />
      {profileData.conflictStyle && (
        <ContinueButton 
          onClick={scrollToNextSection}
          text="Continue to Your Foundation" 
        />
      )}
    </div>
  );
};

export default HowYouOperate;
