
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { datingChallengesOptions } from "./constants";

interface SinglePersonQuestionsProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const SinglePersonQuestions = ({ profileData, handleMultiSelect }: SinglePersonQuestionsProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const isComplete = !!(profileData.datingChallenges?.length);

  return (
    <QuestionCardSimple 
      questionId="question-dating-challenges"
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's your biggest challenge in the dating world right now? <span className="text-red-400">*</span>
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 mb-3 font-normal">
        <Target className="w-3 h-3 text-orange-300" />
        <span>This shapes how you navigate connection challenges</span>
      </div>
      <MultiSelect
        options={datingChallengesOptions}
        selectedValues={profileData.datingChallenges || []}
        onToggle={(value) => handleMultiSelect('datingChallenges', value)}
      />
    </QuestionCardSimple>
  );
};

export default SinglePersonQuestions;
