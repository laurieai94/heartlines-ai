import React from 'react';
import { useStepEngine } from '@/hooks/useStepEngine';
import StepEngine from '@/components/StepEngine';

// Import all the question cards
import NamePronounsCard from '@/components/NewPersonalQuestionnaire/components/sections/WhoYouAre/NamePronounsCard';
import AgeSelectionCard from '@/components/NewPersonalQuestionnaire/components/sections/WhoYouAre/AgeSelectionCard';
import GenderSelectionCard from '@/components/NewPersonalQuestionnaire/components/sections/WhoYouAre/GenderSelectionCard';
import OrientationSelectionCard from '@/components/NewPersonalQuestionnaire/components/sections/WhoYouAre/OrientationSelectionCard';
import AttachmentStyleQuestion from '@/components/NewPersonalQuestionnaire/components/sections/YourFoundation/AttachmentStyleQuestion';
import FamilyStructureQuestion from '@/components/NewPersonalQuestionnaire/components/sections/YourFoundation/FamilyStructureQuestion';
import HeartbreakBetrayalQuestion from '@/components/NewPersonalQuestionnaire/components/sections/YourFoundation/HeartbreakBetrayalQuestion';
import ConflictStyleQuestion from '@/components/NewPersonalQuestionnaire/components/sections/HowYouOperate/ConflictStyleQuestion';
import LoveLanguageQuestion from '@/components/NewPersonalQuestionnaire/components/sections/HowYouOperate/LoveLanguageQuestion';
import StressResponseQuestion from '@/components/NewPersonalQuestionnaire/components/sections/HowYouOperate/StressResponseQuestion';

interface PersonalStepperProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: () => void;
}

const PersonalStepper = ({ profileData, updateField, handleMultiSelect, onComplete }: PersonalStepperProps) => {
  const steps = [
    { id: 'name-pronouns', component: NamePronounsCard },
    { id: 'age', component: AgeSelectionCard },
    { id: 'gender', component: GenderSelectionCard },
    { id: 'orientation', component: OrientationSelectionCard },
    { id: 'attachment', component: AttachmentStyleQuestion },
    { id: 'family', component: FamilyStructureQuestion },
    { id: 'heartbreak', component: HeartbreakBetrayalQuestion },
    { id: 'conflict', component: ConflictStyleQuestion },
    { id: 'love-language', component: LoveLanguageQuestion },
    { id: 'stress', component: StressResponseQuestion },
  ];

  const {
    currentStep,
    totalSteps,
    goNext,
    goPrevious,
    isFirst,
    isLast,
    progress
  } = useStepEngine({
    totalSteps: steps.length,
    onComplete
  });

  const CurrentStepComponent = steps[currentStep]?.component;

  if (!CurrentStepComponent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personal-stepper min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <StepEngine
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
          onNext={goNext}
          onPrevious={goPrevious}
          isFirst={isFirst}
          isLast={isLast}
          nextButtonText={isLast ? "Complete" : "Continue"}
        >
          <CurrentStepComponent
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
            isComplete={true}
            onSectionComplete={() => goNext()}
          />
        </StepEngine>
      </div>
    </div>
  );
};

export default PersonalStepper;