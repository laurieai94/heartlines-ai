
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import SingleSelect from "../../shared/SingleSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { talkingDurationOptions } from "./constants";

interface TalkingStageQuestionsProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const TalkingStageQuestions = ({ 
  profileData, 
  updateField, 
  handleMultiSelect 
}: TalkingStageQuestionsProps) => {
  const { scrollToNextQuestion } = useAutoScroll();

  return (
    <QuestionCard 
      questionId="question-talking-duration"
      showContinue={!!profileData.talkingDuration}
      onContinue={() => scrollToNextQuestion('question-talking-duration')}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        How long have you been talking? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Clock className="w-3 h-3 text-green-300" />
        <span>Early stages have their own unique dynamics and challenges</span>
      </div>
      <SingleSelect
        options={talkingDurationOptions}
        selectedValue={profileData.talkingDuration || ''}
        onSelect={(value) => updateField('talkingDuration', value)}
      />
    </QuestionCard>
  );
};

export default TalkingStageQuestions;
