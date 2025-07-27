import { Label } from "@/components/ui/label";
import { HeartCrack } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { heartbreakBetrayalOptions } from "./constants";

interface HeartbreakBetrayalQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const HeartbreakBetrayalQuestion = ({ 
  profileData, 
  handleMultiSelect 
}: HeartbreakBetrayalQuestionProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const isComplete = profileData.heartbreakBetrayal && profileData.heartbreakBetrayal.length > 0;

  return (
    <QuestionCard 
      questionId="question-heartbreak-betrayal" 
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion('question-heartbreak-betrayal')}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        Have you been through any major heartbreaks or betrayals?
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <HeartCrack className="w-3 h-3 text-red-300" />
        <span>Past pain shapes how you protect yourself.</span>
      </div>

      <MultiSelect
        options={heartbreakBetrayalOptions}
        selectedValues={profileData.heartbreakBetrayal || []}
        onToggle={(value) => handleMultiSelect("heartbreakBetrayal", value)}
        columns={2}
      />
    </QuestionCard>
  );
};

export default HeartbreakBetrayalQuestion;