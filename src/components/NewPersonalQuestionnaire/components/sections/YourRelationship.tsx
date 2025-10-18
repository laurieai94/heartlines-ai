import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../types";
import QuestionCardSimple from "../shared/QuestionCardSimple";
import SingleSelect from "../shared/SingleSelect";
import OptionalGroup from "../shared/OptionalGroup";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { validateSection } from "../../utils/validation";
import { relationshipStatusOptions } from "./YourRelationship/constants";
import { lazy, Suspense } from "react";

// Lazy load relationship sub-components for better performance
const SinglePersonQuestions = lazy(() => import("./YourRelationship/SinglePersonQuestions"));
const RelationshipQuestions = lazy(() => import("./YourRelationship/RelationshipQuestions"));
const TalkingStageQuestions = lazy(() => import("./YourRelationship/TalkingStageQuestions"));
const SeparatedDivorcedQuestions = lazy(() => import("./YourRelationship/SeparatedDivorcedQuestions"));
const WidowedQuestions = lazy(() => import("./YourRelationship/WidowedQuestions"));

const QuestionSkeleton = () => (
  <div className="h-20 animate-pulse bg-white/5 rounded-lg" />
);
interface YourRelationshipProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isActive: boolean;
}
const YourRelationship = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive
}: YourRelationshipProps) => {
  const {
    scrollToNextRequiredQuestion,
    scrollToElement,
  } = useAutoScroll();

  // Normalize old saved values to new display labels for backward compatibility
  const normalizedValue = profileData.relationshipStatus === 'Single & taking a break' 
    ? 'Single & taking a break from dating' 
    : profileData.relationshipStatus === 'In a relationship'
    ? 'In a relationship (official)'
    : profileData.relationshipStatus;

  const isSingle = ['on the apps', 'single & taking a break from dating', 'single & living my best life', 'recently single', 'casually seeing people'].includes(profileData.relationshipStatus?.toLowerCase());
  const isTalking = profileData.relationshipStatus?.toLowerCase() === 'talking stage' || profileData.relationshipStatus?.toLowerCase() === 'soft launching someone new';
  const hasRelationship = ['in a relationship (official)', 'engaged', 'married', 'domestic partnership'].includes(profileData.relationshipStatus?.toLowerCase());
  const isSeparatedDivorced = profileData.relationshipStatus?.toLowerCase() === 'separated/divorced';
  const isWidowed = profileData.relationshipStatus?.toLowerCase() === 'widowed';

  // Section completion check
  const isSectionComplete = validateSection(2, profileData);

  return <div className="-mt-2 space-y-3 transition-opacity duration-300 opacity-100">
      {/* Relationship Status */}
      <QuestionCardSimple questionId="question-relationship-status">
        <Label className="text-sm font-semibold text-white mb-2 block">
          What is your current relationship status? <span className="text-red-400">*</span> <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select the answer that resonates most</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-pink-300" />
          <span>Dating, taken, or somewhere in between? We get it</span>
        </div>
        <SingleSelect options={relationshipStatusOptions} selectedValue={normalizedValue === "It's complicated" ? "Situationship" : (normalizedValue === "Talking to someone" ? "Talking stage" : (normalizedValue || ''))} onSelect={value => updateField('relationshipStatus', value)} />
      </QuestionCardSimple>

      {/* Optional Follow-up Questions */}
      {(isSingle || isTalking || hasRelationship || isSeparatedDivorced || isWidowed) && (
        <OptionalGroup id="relationship-optional-group">
          <Suspense fallback={<QuestionSkeleton />}>
            {isSingle && <SinglePersonQuestions profileData={profileData} handleMultiSelect={handleMultiSelect} />}
            {isTalking && <TalkingStageQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
            {hasRelationship && <RelationshipQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
            {isSeparatedDivorced && <SeparatedDivorcedQuestions profileData={profileData} handleMultiSelect={handleMultiSelect} />}
            {isWidowed && <WidowedQuestions profileData={profileData} updateField={updateField} handleMultiSelect={handleMultiSelect} />}
          </Suspense>
        </OptionalGroup>
      )}
    </div>;
};
export default YourRelationship;