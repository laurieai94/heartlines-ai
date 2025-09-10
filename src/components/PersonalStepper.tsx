import React from 'react';
import { useStepEngine } from '@/hooks/useStepEngine';
import StepEngine from '@/components/StepEngine';

// Import stepper-specific question cards
import StepperNamePronounsCard from './PersonalStepper/StepperNamePronounsCard';
import StepperAgeCard from './PersonalStepper/StepperAgeCard';
import StepperGenderCard from './PersonalStepper/StepperGenderCard';

interface PersonalStepperProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: () => void;
}

const PersonalStepper = ({ profileData, updateField, handleMultiSelect, onComplete }: PersonalStepperProps) => {
  const steps = [
    { id: 'name-pronouns', component: StepperNamePronounsCard },
    { id: 'age', component: StepperAgeCard },
    { id: 'gender', component: StepperGenderCard },
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
            isComplete={true}
            onSectionComplete={() => goNext()}
          />
        </StepEngine>
      </div>
    </div>
  );
};

export default PersonalStepper;