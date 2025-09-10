import React from 'react';
import { useStepEngine } from '@/hooks/useStepEngine';
import StepEngine from '@/components/StepEngine';

// Create simplified versions of question cards that don't need Flow context
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MessageSquare, Heart, Brain, Lightbulb, Users, Clock, Shield } from "lucide-react";
import QuestionCard from '@/components/NewPersonalQuestionnaire/components/shared/QuestionCard';
import SingleSelect from '@/components/NewPersonalQuestionnaire/components/shared/SingleSelect';
import MultiSelect from '@/components/NewPersonalQuestionnaire/components/shared/MultiSelect';

interface PersonalStepperProps {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  onComplete: () => void;
}

// Simplified question components without Flow context dependencies
const NamePronounsStep = ({ profileData, updateField, onNext }: any) => {
  const primaryPronounOptions = ['She/her', 'He/him', 'They/them', 'She/they', 'He/they', 'Other'];
  
  const generateAvatar = (name: string) => {
    if (!name) {
      return (
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/20">
          <User className="w-6 h-6 text-white/60" />
        </div>
      );
    }
    return (
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold border border-white">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {generateAvatar(profileData.name || '')}
          </div>
          <div className="flex-1 min-w-0">
            <Label htmlFor="name" className="text-sm font-semibold text-white mb-2 block">
              What should we call you? <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={profileData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Your name"
              className="questionnaire-input-mobile font-medium w-full"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What pronouns do you use? <span className="text-red-400">*</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <MessageSquare className="w-3 h-3 text-blue-300" />
            <span>So we can refer to you correctly</span>
          </div>
          
          <SingleSelect
            options={primaryPronounOptions}
            selectedValue={profileData.pronouns || ''}
            onSelect={(pronoun) => updateField('pronouns', pronoun)}
          />
        </div>
      </div>
    </div>
  );
};

const AgeStep = ({ profileData, updateField }: any) => {
  const ageOptions = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">What's your age range?</h3>
        <p className="text-white/70 text-sm">This helps us provide age-appropriate guidance</p>
      </div>
      
      <SingleSelect
        options={ageOptions}
        selectedValue={profileData.ageRange || ''}
        onSelect={(age) => updateField('ageRange', age)}
      />
    </div>
  );
};

const GenderStep = ({ profileData, updateField }: any) => {
  const genderOptions = ['Woman', 'Man', 'Non-binary', 'Genderfluid', 'Agender', 'Other'];
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">How do you identify?</h3>
        <p className="text-white/70 text-sm">Your gender identity helps us understand you better</p>
      </div>
      
      <SingleSelect
        options={genderOptions}
        selectedValue={profileData.gender || ''}
        onSelect={(gender) => updateField('gender', gender)}
      />
    </div>
  );
};

const OrientationStep = ({ profileData, updateField }: any) => {
  const orientationOptions = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Questioning', 'Other'];
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">What's your sexual orientation?</h3>
        <p className="text-white/70 text-sm">This is private and helps us give relevant advice</p>
      </div>
      
      <SingleSelect
        options={orientationOptions}
        selectedValue={profileData.orientation || ''}
        onSelect={(orientation) => updateField('orientation', orientation)}
      />
    </div>
  );
};

const AttachmentStep = ({ profileData, updateField }: any) => {
  const attachmentOptions = [
    'Secure - I\'m comfortable with intimacy and independence',
    'Anxious - I worry about being abandoned or unloved',
    'Avoidant - I value independence and avoid getting too close',
    'Disorganized - My feelings about closeness are complicated'
  ];
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-6 space-y-4">
      <div className="text-center mb-6">
        <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
        <h3 className="text-xl font-semibold text-white mb-2">How do you connect in relationships?</h3>
        <p className="text-white/70 text-sm">Your attachment style shapes how you bond with others</p>
      </div>
      
      <SingleSelect
        options={attachmentOptions}
        selectedValue={profileData.attachmentStyle || ''}
        onSelect={(attachment) => updateField('attachmentStyle', attachment)}
      />
    </div>
  );
};

const PersonalStepper = ({ profileData, updateField, handleMultiSelect, onComplete }: PersonalStepperProps) => {
  const steps = [
    { id: 'name-pronouns', component: NamePronounsStep, title: 'About You' },
    { id: 'age', component: AgeStep, title: 'Age Range' },
    { id: 'gender', component: GenderStep, title: 'Gender Identity' },
    { id: 'orientation', component: OrientationStep, title: 'Sexual Orientation' },
    { id: 'attachment', component: AttachmentStep, title: 'Attachment Style' },
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Personal Profile</h1>
            <p className="text-white/70">Help us understand you better to provide personalized guidance</p>
          </div>
          
          <StepEngine
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
            onNext={goNext}
            onPrevious={goPrevious}
            isFirst={isFirst}
            isLast={isLast}
            nextButtonText={isLast ? "Complete Profile" : "Continue"}
            showNavigation={false}
          >
            <CurrentStepComponent
              profileData={profileData}
              updateField={updateField}
              handleMultiSelect={handleMultiSelect}
              onNext={goNext}
            />
            
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goPrevious}
                disabled={isFirst}
                className={`px-6 py-3 rounded-lg transition-all ${
                  isFirst 
                    ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                Back
              </button>
              
              <button
                onClick={goNext}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-semibold"
              >
                {isLast ? "Complete Profile" : "Continue"}
              </button>
            </div>
          </StepEngine>
        </div>
      </div>
    </div>
  );
};

export default PersonalStepper;