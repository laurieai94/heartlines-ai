
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { loveLanguageOptions } from "./constants";

interface LoveLanguageQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onSectionComplete?: () => void;
}

const LoveLanguageQuestion = ({ 
  profileData, 
  handleMultiSelect,
  onSectionComplete
}: LoveLanguageQuestionProps) => {
  const { scrollToNextRequiredQuestion } = useAutoScroll();
  const isComplete = !!(profileData.loveLanguage?.length);

  return (
    <QuestionCardSimple 
      questionId="question-love-language"
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        how do you feel most loved? <span className="text-red-400">*</span>
        <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Heart className="w-3 h-3 text-pink-300" />
        <span>knowing this helps you actually ask for what you need</span>
      </div>
      <MultiSelect 
        options={loveLanguageOptions} 
        selectedValues={profileData.loveLanguage || []} 
        onToggle={value => handleMultiSelect('loveLanguage', value)} 
      />
    </QuestionCardSimple>
  );
};

export default LoveLanguageQuestion;
