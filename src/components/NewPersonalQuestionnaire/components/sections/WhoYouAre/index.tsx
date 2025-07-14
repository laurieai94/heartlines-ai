import { User } from "lucide-react";
import { ProfileData } from "../../../types";
import { validateSection } from "../../../utils/validation";
import SectionContinueButton from "../../shared/SectionContinueButton";
import NamePronounsCard from "./NamePronounsCard";
import AgeSelectionCard from "./AgeSelectionCard";
import OrientationSelectionCard from "./OrientationSelectionCard";
import GenderSelectionCard from "./GenderSelectionCard";

interface WhoYouAreProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const WhoYouAre = ({ profileData, updateField, handleMultiSelect, isActive, onSectionComplete }: WhoYouAreProps) => {
  // Helper function to check if pronouns are complete (duplicated here to avoid complex prop passing)
  const isPronounsComplete = () => {
    if (!profileData.pronouns) return false;
    if (profileData.pronouns === 'Other') {
      // For 'Other', we need to check if there's a custom value that's not just 'Other'
      return profileData.pronouns !== 'Other';
    }
    return true;
  };

  // Question completion checks
  const isNamePronounsComplete = profileData.name && isPronounsComplete();
  const isAgeComplete = !!profileData.age;
  const isOrientationComplete = !!(profileData.orientation && profileData.orientation.trim() !== '');
  const isGenderComplete = !!(profileData.gender && profileData.gender.trim() !== '');
  
  // Section completion check
  const isSectionComplete = validateSection(1, profileData);

  // Navigation functions
  const scrollToQuestion = (questionId: string) => {
    const element = document.getElementById(questionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`space-y-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">The Basics</h3>
      </div>

      {/* Name and Pronouns Combined */}
      <NamePronounsCard
        profileData={profileData}
        updateField={updateField}
        isComplete={isNamePronounsComplete}
        onContinue={() => scrollToQuestion('question-age')}
      />

      {/* Age */}
      <AgeSelectionCard
        profileData={profileData}
        updateField={updateField}
        isComplete={isAgeComplete}
        onContinue={() => scrollToQuestion('question-orientation')}
      />

      {/* Sexual Orientation */}
      <OrientationSelectionCard
        profileData={profileData}
        updateField={updateField}
        isComplete={isOrientationComplete}
        onContinue={() => scrollToQuestion('question-gender')}
      />

      {/* Gender Identity */}
      <GenderSelectionCard
        profileData={profileData}
        updateField={updateField}
      />

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={1}
        onClick={() => {
          // Scroll to first question of next section
          setTimeout(() => {
            const nextSectionFirstQuestion = document.querySelector('[data-section="2"] [data-question-card]');
            if (nextSectionFirstQuestion) {
              nextSectionFirstQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          onSectionComplete?.();
        }}
      />
    </div>
  );
};

export default WhoYouAre;