
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { conflictStyleOptions } from "./constants";

interface ConflictStyleQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  isSectionComplete: boolean;
  onSectionComplete?: () => void;
}

const ConflictStyleQuestion = ({
  profileData,
  handleMultiSelect,
  isSectionComplete,
  onSectionComplete
}: ConflictStyleQuestionProps) => {
  return (
    <QuestionCard 
      questionId="question-conflict-style" 
      showContinue={!!profileData.conflictStyle?.length} 
      onContinue={() => {
        // This is the last question in the section, trigger section completion if ready
        if (isSectionComplete) {
          onSectionComplete?.();
        }
      }}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        How do you typically handle conflict? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Shield className="w-3 h-3 text-blue-300" />
        <span>Your conflict style is everything in relationships</span>
      </div>
      <MultiSelect 
        options={conflictStyleOptions} 
        selectedValues={profileData.conflictStyle || []} 
        onToggle={value => handleMultiSelect('conflictStyle', value)} 
      />
    </QuestionCard>
  );
};

export default ConflictStyleQuestion;
