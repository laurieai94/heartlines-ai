
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { loveLanguageOptions } from "./constants";

interface LoveLanguageQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const LoveLanguageQuestion = ({ 
  profileData, 
  handleMultiSelect 
}: LoveLanguageQuestionProps) => {
  const { scrollToNextRequiredQuestion } = useAutoScroll();
  const isComplete = !!(profileData.loveLanguage?.length);

  return (
    <QuestionCard 
      questionId="question-love-language"
      showContinue={isComplete}
      onContinue={() => scrollToNextRequiredQuestion('question-love-language')}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        How do you feel most loved? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Heart className="w-3 h-3 text-pink-300" />
        <span> Knowing this helps you actually ask for what you need</span>
      </div>
      <MultiSelect 
        options={loveLanguageOptions} 
        selectedValues={profileData.loveLanguage || []} 
        onToggle={value => handleMultiSelect('loveLanguage', value)} 
        columns={3}
      />
    </QuestionCard>
  );
};

export default LoveLanguageQuestion;
