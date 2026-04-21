import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import SingleSelect from "../../shared/SingleSelect";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { timeSinceLossOptions, grievingProcessOptions } from "./constants";

interface WidowedQuestionsProps {
  profileData: ProfileData;
  updateField: (field: keyof ProfileData, value: any) => void;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const WidowedQuestions = ({ 
  profileData, 
  updateField,
  handleMultiSelect 
}: WidowedQuestionsProps) => {
  const { scrollToNextQuestion } = useAutoScroll();

  return (
    <>
      {/* Time Since Loss */}
      <QuestionCardSimple 
        questionId="question-time-since-loss"
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          How long has it been since your loss? <span className="text-red-400">*</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-violet-300" />
          <span>Just helping us understand where you're at</span>
        </div>
        <SingleSelect
          options={timeSinceLossOptions}
          selectedValue={profileData.timeSinceLoss || ''}
          onSelect={(value) => updateField('timeSinceLoss', value)}
        />
      </QuestionCardSimple>

      {/* Grieving Process */}
      {profileData.timeSinceLoss && (
        <QuestionCardSimple 
          questionId="question-grieving-process"
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            Where do you feel you are in your grieving process? <span className="text-red-400">*</span>
            <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-indigo-300" />
            <span>Grief is messy and that's completely normal</span>
          </div>
          <MultiSelect
            options={grievingProcessOptions}
            selectedValues={profileData.grievingProcess || []}
            onToggle={(value) => handleMultiSelect('grievingProcess', value)}
          />
        </QuestionCardSimple>
      )}
    </>
  );
};

export default WidowedQuestions;