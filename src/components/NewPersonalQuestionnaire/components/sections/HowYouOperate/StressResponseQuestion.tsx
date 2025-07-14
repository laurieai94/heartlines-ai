
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { stressResponseOptions } from "./constants";

interface StressResponseQuestionProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onContinue?: () => void;
}

const StressResponseQuestion = ({ 
  profileData, 
  handleMultiSelect, 
  onContinue 
}: StressResponseQuestionProps) => {
  return (
    <QuestionCard 
      questionId="question-stress-response" 
      showContinue={!!profileData.stressResponse?.length} 
      onContinue={onContinue}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        When you're stressed, what's your go-to? <span className="text-red-400">*</span>
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
        <Zap className="w-3 h-3 text-orange-300" />
        <span>Stress patterns affect how you show up in relationships</span>
      </div>
      <MultiSelect 
        options={stressResponseOptions} 
        selectedValues={profileData.stressResponse || []} 
        onToggle={value => handleMultiSelect('stressResponse', value)} 
      />
    </QuestionCard>
  );
};

export default StressResponseQuestion;
