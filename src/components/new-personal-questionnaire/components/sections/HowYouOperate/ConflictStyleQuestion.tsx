import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
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
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  const isComplete = !!profileData.conflictStyle?.length;
  return <QuestionCardSimple questionId="question-conflict-style">
      <Label className="text-sm font-semibold text-white mb-2 block">
        how do you typically handle conflict?
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Shield className="w-3 h-3 text-blue-300" />
        <span>how you fight determines if you make it</span>
      </div>
      <MultiSelect options={conflictStyleOptions} selectedValues={profileData.conflictStyle || []} onToggle={value => handleMultiSelect('conflictStyle', value)} />
    </QuestionCardSimple>;
};
export default ConflictStyleQuestion;