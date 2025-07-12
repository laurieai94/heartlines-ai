
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Heart, Clock, MessageSquare, Target, AlertTriangle, Star } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import MultiSelect from "../shared/MultiSelect";
import SingleSelect from "../shared/SingleSelect";
import SectionContinueButton from "../shared/SectionContinueButton";
import { validateSection } from "../../utils/validation";

interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete?: () => void;
}

const YourRelationship = ({ profileData, updateField, handleMultiSelect, isActive, onSectionComplete }: YourRelationshipProps) => {
  const relationshipStatusOptions = [
    'Single & actively dating',
    'Single & taking a break', 
    'Casually seeing people',
    'Talking to someone',
    'In a relationship',
    'Engaged',
    'Married',
    'Separated/Divorced',
    'It\'s complicated'
  ];

  const relationshipLengthOptions = [
    'Less than 3 months', '3-6 months', '6 months - 1 year', 
    '1-2 years', '2-5 years', '5+ years'
  ];

  const datingChallengesOptions = [
    'Finding people who want the same thing I do',
    'Getting past the first few dates into something deeper',
    'Setting boundaries and not settling for less than I deserve',
    'Dating anxiety and putting myself out there',
    'Getting over past relationship patterns that keep showing up',
    'Being authentic while still trying to make a good impression',
    'Online dating fatigue and app overwhelm'
  ];

  const relationshipChallengesOptions = [
    'Communication and really hearing each other',
    'Managing conflict without it getting ugly',
    'Balancing independence with togetherness',
    'Intimacy and staying connected',
    'Different life goals or timelines',
    'Trust and past relationship baggage',
    'Family or external pressures',
    'Money and financial stress',
    'Managing expectations vs reality'
  ];

  const relationshipWorkingOptions = [
    'We communicate really well',
    'Great physical and emotional intimacy',
    'We support each other\'s goals',
    'Similar values and life vision',
    'We have fun together and laugh a lot',
    'Good at working through disagreements',
    'We give each other space to be individuals',
    'Strong friendship foundation',
    'We\'re building something meaningful together'
  ];

  const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
  const hasRelationship = ['Talking to someone', 'In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);

  // Question completion checks
  const isStatusComplete = profileData.relationshipStatus;
  const isDatingChallengesComplete = isSingle ? (profileData.datingChallenges && profileData.datingChallenges.length > 0) : true;
  const isLengthComplete = hasRelationship ? profileData.relationshipLength : true;
  const isChallengesComplete = hasRelationship ? (profileData.relationshipChallenges && profileData.relationshipChallenges.length > 0) : true;
  const isWorkingComplete = hasRelationship ? (profileData.relationshipWorking && profileData.relationshipWorking.length > 0) : true;
  
  // Section completion check
  const isSectionComplete = validateSection(2, profileData);

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
        <Heart className="w-5 h-5 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Your Situationship</h3>
      </div>

      {/* Relationship Status */}
      <QuestionCard 
        questionId="question-relationship-status"
        showContinue={isStatusComplete && (
          (isSingle && !isDatingChallengesComplete) ||
          (hasRelationship && !isLengthComplete)
        )}
        onContinue={() => {
          if (isSingle) {
            scrollToQuestion('question-dating-challenges');
          } else if (hasRelationship) {
            scrollToQuestion('question-relationship-length');
          }
        }}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What is your current relationship status? <span className="text-red-400">*</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>From 'it's complicated' to married - we meet you where you are</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {relationshipStatusOptions.map((status) => (
            <button
              key={status}
              onClick={() => updateField('relationshipStatus', status)}
              className={`w-full p-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.01] text-xs font-medium ${
                profileData.relationshipStatus === status
                  ? 'questionnaire-button-selected'
                  : 'questionnaire-button-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </QuestionCard>

      {/* Dating Challenges - for single people */}
      {isSingle && (
        <QuestionCard 
          questionId="question-dating-challenges"
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 mb-3 font-normal">
            <Target className="w-3 h-3 text-orange-300" />
            <span>This shapes how you navigate connection challenges</span>
          </div>
          <MultiSelect
            options={datingChallengesOptions}
            selectedValues={profileData.datingChallenges || []}
            onToggle={(value) => handleMultiSelect('datingChallenges', value)}
          />
        </QuestionCard>
      )}

      {/* Relationship Length - for people in relationships */}
      {hasRelationship && (
        <QuestionCard 
          questionId="question-relationship-length"
          showContinue={isLengthComplete && !isChallengesComplete}
          onContinue={() => scrollToQuestion('question-relationship-challenges')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            How long have you been together? <span className="text-red-400">*</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Clock className="w-3 h-3 text-green-300" />
            <span>Different relationship stages have different needs and challenges</span>
          </div>
          <SingleSelect
            options={relationshipLengthOptions}
            selectedValue={profileData.relationshipLength || ''}
            onSelect={(value) => updateField('relationshipLength', value)}
          />
        </QuestionCard>
      )}

      {/* Relationship Challenges - for people in relationships */}
      {hasRelationship && (
        <QuestionCard 
          questionId="question-relationship-challenges"
          showContinue={isChallengesComplete && !isWorkingComplete}
          onContinue={() => scrollToQuestion('question-relationship-working')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging in your relationship right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-red-300" />
            <span>Challenges help us understand what to work on</span>
          </div>
          <MultiSelect
            options={relationshipChallengesOptions}
            selectedValues={profileData.relationshipChallenges || []}
            onToggle={(value) => handleMultiSelect('relationshipChallenges', value)}
          />
        </QuestionCard>
      )}

      {/* What's Working Well - for people in relationships */}
      {hasRelationship && (
        <QuestionCard questionId="question-relationship-working">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's working really well in your relationship? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Star className="w-3 h-3 text-green-300" />
            <span>Knowing what works helps us build on your strengths</span>
          </div>
          <MultiSelect
            options={relationshipWorkingOptions}
            selectedValues={profileData.relationshipWorking || []}
            onToggle={(value) => handleMultiSelect('relationshipWorking', value)}
          />
        </QuestionCard>
      )}

      {/* Section Continue Button */}
      <SectionContinueButton
        isVisible={isSectionComplete}
        currentSection={2}
        onClick={() => onSectionComplete?.()}
      />
    </div>
  );
};

export default YourRelationship;
