import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import { validateSection } from "../../../utils/validation";
import SectionContinueButton from "../../shared/SectionContinueButton";
import SimpleContinueButton from "../../shared/SimpleContinueButton";
import NamePronounsCard from "./WhoYouAre/NamePronounsCard";
import AgeSelectionCard from "./WhoYouAre/AgeSelectionCard";
import OrientationSelectionCard from "./WhoYouAre/OrientationSelectionCard";
import GenderSelectionCard from "./WhoYouAre/GenderSelectionCard";

interface WhoYouAreProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const WhoYouAre = ({ profileData, updateField, handleMultiSelect, isActive, onSectionComplete }: WhoYouAreProps) => {
  const isSectionComplete = validateSection(1, profileData);

  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('[data-section="2"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onSectionComplete?.();
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`} data-section="1">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">The Basics</h3>
      </div>

      <NamePronounsCard
        profileData={profileData}
        updateField={updateField}
      />
      {profileData.name && profileData.pronouns && (
        <SimpleContinueButton onClick={() => scrollToQuestion('question-age')} />
      )}

      <AgeSelectionCard
        profileData={profileData}
        updateField={updateField}
      />
      {profileData.age && (
        <SimpleContinueButton onClick={() => scrollToQuestion('question-orientation')} />
      )}

      <OrientationSelectionCard
        profileData={profileData}
        updateField={updateField}
      />
      {profileData.orientation && (
        <SimpleContinueButton onClick={() => scrollToQuestion('question-gender')} />
      )}

      <GenderSelectionCard
        profileData={profileData}
        updateField={updateField}
      />
      {isSectionComplete && (
        <SectionContinueButton 
          onClick={scrollToNextSection}
          text="Continue to Your Relationship" 
        />
      )}
    </div>
  );
};

export default WhoYouAre;