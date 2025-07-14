
import { Zap } from "lucide-react";
import { ProfileData } from "../../types";

import { validateSection } from "../../utils/validation";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import SectionContinueButton from "../shared/SectionContinueButton";
import StressResponseQuestion from "./HowYouOperate/StressResponseQuestion";
import LoveLanguageQuestion from "./HowYouOperate/LoveLanguageQuestion";
import ConflictStyleQuestion from "./HowYouOperate/ConflictStyleQuestion";

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
  const { scrollToNextSection } = useAutoScroll();
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
      />

      <LoveLanguageQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      <ConflictStyleQuestion
        profileData={profileData}
        handleMultiSelect={handleMultiSelect}
      />

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={3}
        onClick={() => scrollToNextSection(3)}
      />
    </div>
  );
};

export default HowYouOperate;
