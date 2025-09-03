import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCard from "../shared/QuestionCard";
import SingleSelect from "../shared/SingleSelect";
import OptionalGroup from "../shared/OptionalGroup";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { validateSection } from "../../utils/validation";
import { relationshipStatusOptions } from "./YourRelationship/constants";
import SinglePersonQuestions from "./YourRelationship/SinglePersonQuestions";
import RelationshipQuestions from "./YourRelationship/RelationshipQuestions";
import TalkingStageQuestions from "./YourRelationship/TalkingStageQuestions";
import SeparatedDivorcedQuestions from "./YourRelationship/SeparatedDivorcedQuestions";
import WidowedQuestions from "./YourRelationship/WidowedQuestions";
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
  const {
    scrollToNextRequiredQuestion
  } = useAutoScroll();

  // Normalize old saved values to new display labels for backward compatibility
  const normalizedValue = profileData.relationshipStatus === 'Single & taking a break' 
    ? 'Single & taking a break from dating' 
    : profileData.relationshipStatus === 'In a relationship'
    ? 'In a relationship (official)'
    : profileData.relationshipStatus;

  const isSingle = ['On the apps', 'Single & actively dating', 'Single & taking a break', 'Single & taking a break from dating', 'Casually seeing people'].includes(profileData.relationshipStatus);
  const isTalking = profileData.relationshipStatus === 'Talking stage' || profileData.relationshipStatus === 'Talking to someone';
  const hasRelationship = ['In a relationship', 'In a relationship (official)', 'Engaged', 'Married', 'Domestic partnership'].includes(profileData.relationshipStatus);
  const isSeparatedDivorced = profileData.relationshipStatus === 'Separated/Divorced';
  const isWidowed = profileData.relationshipStatus === 'Widowed';

  // Section completion check
  const isSectionComplete = validateSection(2, profileData);
  const getNextQuestionAfterStatus = () => {
    if (isSingle) return 'question-dating-challenges';
    if (isTalking) return 'question-talking-duration';
    if (hasRelationship) return 'question-relationship-length';
    if (isSeparatedDivorced) return 'question-separation-situation';
    if (isWidowed) return 'question-time-since-loss';
    return null;
  };
  const shouldShowContinueAfterStatus = () => {
    // Show continue button immediately after selecting a relationship status
    return !!profileData.relationshipStatus;
  };

  const handleContinueAfterStatus = () => {
    // Use onSectionComplete if provided (layout-managed navigation)
    // Otherwise use scroll-based navigation as fallback
    if (onSectionComplete) {
      console.log('🟢 YourRelationship: Using onSectionComplete for navigation');
      onSectionComplete();
    } else {
      console.log('🟢 YourRelationship: Using scrollToNextRequiredQuestion fallback');
      scrollToNextRequiredQuestion('question-relationship-status');
    }
  };

  return <div className="space-y-4 transition-opacity duration-300 opacity-100">
      {/* Relationship Status */}
      <QuestionCard questionId="question-relationship-status" showContinue={shouldShowContinueAfterStatus()} onContinue={handleContinueAfterStatus}>
        <Label className="text-sm font-semibold text-white mb-2 block">
          What is your current relationship status? <span className="text-red-400">*</span> <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select the answer that resonates most</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>Dating, taken, or somewhere in between? We get it</span>
        </div>
        <SingleSelect options={relationshipStatusOptions} selectedValue={normalizedValue === "It's complicated" ? "Situationship" : (normalizedValue === "Talking to someone" ? "Talking stage" : (normalizedValue || ''))} onSelect={value => updateField('relationshipStatus', value)} />
      </QuestionCard>

      {/* Optional Follow-up Questions */}
      {(isSingle || isTalking || hasRelationship || isSeparatedDivorced || isWidowed) && (
        <OptionalGroup>
          {isSingle && <SinglePersonQuestions profileData={profileData} handleMultiSelect={handleMultiSelect} />}
          {isTalking && <TalkingStageQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
          {hasRelationship && <RelationshipQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
          {isSeparatedDivorced && <SeparatedDivorcedQuestions profileData={profileData} handleMultiSelect={handleMultiSelect} />}
          {isWidowed && <WidowedQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
        </OptionalGroup>
      )}
    </div>;
};
export default YourRelationship;