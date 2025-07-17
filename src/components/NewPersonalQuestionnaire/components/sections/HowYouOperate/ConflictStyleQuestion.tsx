
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { conflictStyleOptions } from "./constants";

interface ConflictStyleQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const ConflictStyleQuestion = ({ 
  profileData, 
  handleMultiSelect 
}: ConflictStyleQuestionProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const isComplete = !!(profileData.conflictStyle?.length);

  return (
    <QuestionCard 
      questionId="question-conflict-style"
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion('question-conflict-style')}
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
        columns={2}
      />
    </QuestionCard>
  );
};

export default ConflictStyleQuestion;
