import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { stressResponseOptions } from "./constants";
interface StressResponseQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}
const StressResponseQuestion = ({
  profileData,
  handleMultiSelect
}: StressResponseQuestionProps) => {
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  const isComplete = !!profileData.stressResponse?.length;
  return <QuestionCard questionId="question-stress-response" showContinue={isComplete} onContinue={() => scrollToNextQuestion('question-stress-response')}>
      <Label className="text-sm font-semibold text-white mb-2 block">
        When life gets chaotic, where do you run?
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Zap className="w-3 h-3 text-orange-300" />
        <span>Stress patterns affect how you show up for people</span>
      </div>
      <MultiSelect options={stressResponseOptions} selectedValues={profileData.stressResponse || []} onToggle={value => handleMultiSelect('stressResponse', value)} columns={2} />
    </QuestionCard>;
};
export default StressResponseQuestion;