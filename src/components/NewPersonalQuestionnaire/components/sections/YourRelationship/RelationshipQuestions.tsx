
import { Label } from "@/components/ui/label";
import { Clock, AlertTriangle, Star } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import MultiSelect from "../../shared/MultiSelect";
import SimpleContinueButton from "../../shared/SimpleContinueButton";
import { relationshipLengthOptions, relationshipChallengesOptions, relationshipWorkingOptions } from "./constants";

interface RelationshipQuestionsProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onAutoScroll?: (questionId: string) => void;
}

const RelationshipQuestions = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  onAutoScroll 
}: RelationshipQuestionsProps) => {
  return (
    <>
      {/* Relationship Length */}
      <QuestionCard questionId="question-relationship-length">
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
        {profileData.relationshipLength && (
          <SimpleContinueButton 
            onClick={() => {
              const element = document.getElementById('question-relationship-challenges');
              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="mt-4"
          />
        )}
      </QuestionCard>

      {/* Relationship Challenges */}
      {profileData.relationshipLength && (
        <QuestionCard questionId="question-relationship-challenges">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging right now? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-red-300" />
            <span>This helps us understand what to focus on</span>
          </div>
          <MultiSelect
            options={relationshipChallengesOptions}
            selectedValues={profileData.relationshipChallenges || []}
            onToggle={(value) => handleMultiSelect('relationshipChallenges', value)}
          />
          {(profileData.relationshipChallenges?.length) && (
            <SimpleContinueButton 
              onClick={() => {
                const element = document.getElementById('question-relationship-working');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="mt-4"
            />
          )}
        </QuestionCard>
      )}

      {/* What's Working Well */}
      {(profileData.relationshipChallenges?.length) && (
        <QuestionCard questionId="question-relationship-working">
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's working really well between you two? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Star className="w-3 h-3 text-green-300" />
            <span>We want to build on your strengths</span>
          </div>
          <MultiSelect
            options={relationshipWorkingOptions}
            selectedValues={profileData.relationshipWorking || []}
            onToggle={(value) => handleMultiSelect('relationshipWorking', value)}
          />
        </QuestionCard>
      )}
    </>
  );
};

export default RelationshipQuestions;
