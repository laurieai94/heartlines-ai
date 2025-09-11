import React from 'react';
import { useStepEngine } from '@/hooks/useStepEngine';
import StepEngine from '@/components/StepEngine';

// Import all the partner question cards
import PartnerNamePronounsCard from '@/components/NewPartnerProfile/components/questions/PartnerNamePronounsCard';
import PartnerAgeCard from '@/components/NewPartnerProfile/components/questions/PartnerAgeCard';
import PartnerGenderCard from '@/components/NewPartnerProfile/components/questions/PartnerGenderCard';
import PartnerOrientationCard from '@/components/NewPartnerProfile/components/questions/PartnerOrientationCard';
import PartnerAttachmentCard from '@/components/NewPartnerProfile/components/questions/PartnerAttachmentCard';
import PartnerFamilyDynamicCard from '@/components/NewPartnerProfile/components/questions/PartnerFamilyDynamicCard';
import PartnerHeartbreakBetrayalCard from '@/components/NewPartnerProfile/components/questions/PartnerHeartbreakBetrayalCard';
import PartnerSelfAwarenessCard from '@/components/NewPartnerProfile/components/questions/PartnerSelfAwarenessCard';
import PartnerLoveLanguageCard from '@/components/NewPartnerProfile/components/questions/PartnerLoveLanguageCard';
import PartnerConflictCard from '@/components/NewPartnerProfile/components/questions/PartnerConflictCard';
import PartnerCommunicationResponseCard from '@/components/NewPartnerProfile/components/questions/PartnerCommunicationResponseCard';

interface PartnerStepperProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: () => void;
}

const PartnerStepper = ({ profileData, updateField, handleMultiSelect, onComplete }: PartnerStepperProps) => {
  const steps = [
    { id: 'partner-name-pronouns', component: PartnerNamePronounsCard },
    { id: 'partner-age', component: PartnerAgeCard },
    { id: 'partner-gender', component: PartnerGenderCard },
    { id: 'partner-orientation', component: PartnerOrientationCard },
    { id: 'partner-attachment', component: PartnerAttachmentCard },
    { id: 'partner-family-dynamic', component: PartnerFamilyDynamicCard },
    { id: 'partner-heartbreak-betrayal', component: PartnerHeartbreakBetrayalCard },
    { id: 'partner-self-awareness', component: PartnerSelfAwarenessCard },
    { id: 'partner-love-language', component: PartnerLoveLanguageCard },
    { id: 'partner-conflict', component: PartnerConflictCard },
    { id: 'partner-communication-response', component: PartnerCommunicationResponseCard },
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
    <div className="partner-stepper min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <StepEngine
          currentStep={currentStep}
          totalSteps={totalSteps}
          progress={progress}
          onNext={goNext}
          onPrevious={goPrevious}
          isFirst={isFirst}
          isLast={isLast}
          nextButtonText={isLast ? "Complete Profile" : "Continue"}
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

export default PartnerStepper;