import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { attachmentStyleOptions } from "./constants";
import { Button } from "@/components/ui/button";
interface AttachmentStyleQuestionProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  onComplete?: () => void;
  onQuestionComplete?: () => void;
  onSectionComplete?: () => void;
}
const AttachmentStyleQuestion = ({
  profileData,
  updateField,
  onComplete,
  onQuestionComplete,
  onSectionComplete
}: AttachmentStyleQuestionProps) => {
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  const isComplete = !!profileData.attachmentStyle;
  return <QuestionCard 
    questionId="question-attachment-style"
    showContinue={isComplete}
    onContinue={onSectionComplete || (() => scrollToNextQuestion('question-attachment-style'))}
  >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your attachment style? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-xs ml-2">Select one</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Link className="w-3 h-3 text-purple-300" />
        <span>The psychological patterns that run your relationships</span>
      </div>
      <SingleSelect 
        options={attachmentStyleOptions} 
        selectedValue={profileData.attachmentStyle || ''} 
        onSelect={value => {
          updateField('attachmentStyle', value);
        }}
      />
    </QuestionCard>;
};
export default AttachmentStyleQuestion;