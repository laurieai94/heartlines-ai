
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import SingleSelect from "../shared/SingleSelect";
import { useAutoScroll } from "../../hooks/useAutoScroll";

import { validateSection } from "../../utils/validation";
import { relationshipStatusOptions } from "./YourRelationship/constants";
import SinglePersonQuestions from "./YourRelationship/SinglePersonQuestions";
import RelationshipQuestions from "./YourRelationship/RelationshipQuestions";
import TalkingStageQuestions from "./YourRelationship/TalkingStageQuestions";
import SeparatedDivorcedQuestions from "./YourRelationship/SeparatedDivorcedQuestions";

interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
  
  onSectionComplete?: () => void;
}

const YourRelationship = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isActive, 
   
  onSectionComplete 
}: YourRelationshipProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  
  const isSingle = ['Single & actively dating', 'Single & taking a break', 'Casually seeing people'].includes(profileData.relationshipStatus);
  const isTalking = profileData.relationshipStatus === 'Talking to someone';
  const hasRelationship = ['In a relationship', 'Engaged', 'Married'].includes(profileData.relationshipStatus);
  const isSeparatedDivorced = profileData.relationshipStatus === 'Separated/Divorced';

  // Section completion check
  const isSectionComplete = validateSection(2, profileData);

  const getNextQuestionAfterStatus = () => {
    if (isSingle) return 'question-dating-challenges';
    if (isTalking) return 'question-talking-duration';
    if (hasRelationship) return 'question-relationship-length';
    if (isSeparatedDivorced) return 'question-separation-situation';
    return null;
  };

  const shouldShowContinueAfterStatus = () => {
    // Show continue button immediately after selecting a relationship status
    // This will guide users to the next question in their flow
    return !!profileData.relationshipStatus && !isSectionComplete;
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
        showContinue={shouldShowContinueAfterStatus()}
        onContinue={() => {
          const nextQuestionId = getNextQuestionAfterStatus();
          if (nextQuestionId) {
            scrollToNextQuestion('question-relationship-status');
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
        <SingleSelect
          options={relationshipStatusOptions}
          selectedValue={profileData.relationshipStatus || ''}
          onSelect={(value) => updateField('relationshipStatus', value)}
          columns={3}
        />
      </QuestionCard>

      {/* Render appropriate question flow based on relationship status */}
        {isSingle && (
          <SinglePersonQuestions 
            profileData={profileData}
            handleMultiSelect={handleMultiSelect}
          />
        )}

      {isTalking && (
        <TalkingStageQuestions
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
        />
      )}

      {hasRelationship && (
        <RelationshipQuestions
          profileData={profileData}
          updateField={updateField}
          handleMultiSelect={handleMultiSelect}
        />
      )}

      {isSeparatedDivorced && (
        <SeparatedDivorcedQuestions
          profileData={profileData}
          handleMultiSelect={handleMultiSelect}
        />
      )}
    </div>
  );
};

export default YourRelationship;
