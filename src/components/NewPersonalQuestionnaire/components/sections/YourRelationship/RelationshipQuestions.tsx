
import { Label } from "@/components/ui/label";
import { Clock, AlertTriangle, Star } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { relationshipLengthOptions, relationshipChallengesOptions, relationshipWorkingOptions } from "./constants";

interface RelationshipQuestionsProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const RelationshipQuestions = ({ 
  profileData, 
  updateField, 
  handleMultiSelect 
}: RelationshipQuestionsProps) => {
  const { scrollToNextQuestion } = useAutoScroll();

  return (
    <>
      {/* Relationship Length */}
      <QuestionCard 
        questionId="question-relationship-length"
        showContinue={!!profileData.relationshipLength}
        onContinue={() => scrollToNextQuestion('question-relationship-length')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          How long have you been together? <span className="text-red-400">*</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Clock className="w-3 h-3 text-green-300" />
          <span>Different relationship stages have different needs and challenges</span>
        </div>
        <SingleSelect
          options={relationshipLengthOptions}
          selectedValue={profileData.relationshipLength || ''}
          onSelect={(value) => updateField('relationshipLength', value)}
          columns={3}
        />
      </QuestionCard>

      {/* Relationship Challenges */}
      {profileData.relationshipLength && (
        <QuestionCard 
          questionId="question-relationship-challenges"
          showContinue={!!(profileData.relationshipChallenges?.length)}
          onContinue={() => scrollToNextQuestion('question-relationship-challenges')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What feels most challenging right now? <span className="text-red-400">*</span>
            <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <AlertTriangle className="w-3 h-3 text-red-300" />
            <span>This helps us understand what to focus on</span>
          </div>
          <MultiSelect
            options={relationshipChallengesOptions}
            selectedValues={profileData.relationshipChallenges || []}
            onToggle={(value) => handleMultiSelect('relationshipChallenges', value)}
            columns={3}
          />
        </QuestionCard>
      )}

      {/* What's Working Well */}
      {(profileData.relationshipChallenges?.length > 0) && (
        <QuestionCard 
          questionId="question-relationship-working"
          showContinue={!!(profileData.relationshipWorking?.length)}
          onContinue={() => scrollToNextQuestion('question-relationship-working')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            What's working really well between you two? <span className="text-red-400">*</span>
            <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Star className="w-3 h-3 text-green-300" />
            <span>We want to build on your strengths</span>
          </div>
          <MultiSelect
            options={relationshipWorkingOptions}
            selectedValues={profileData.relationshipWorking || []}
            onToggle={(value) => handleMultiSelect('relationshipWorking', value)}
            columns={3}
          />
        </QuestionCard>
      )}
    </>
  );
};

export default RelationshipQuestions;
