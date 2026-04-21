
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCardSimple from "../../shared/QuestionCardSimple";
import MultiSelect from "../../shared/MultiSelect";
import { useAutoScroll } from "../../../hooks/useAutoScroll";
import { separationSituationOptions, datingReadinessOptions } from "./constants";

interface SeparatedDivorcedQuestionsProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
}

const SeparatedDivorcedQuestions = ({ 
  profileData, 
  handleMultiSelect 
}: SeparatedDivorcedQuestionsProps) => {
  const { scrollToNextQuestion } = useAutoScroll();

  return (
    <>
      {/* Separation Situation */}
      <QuestionCardSimple 
        questionId="question-separation-situation"
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your situation right now? <span className="text-red-400">*</span>
          <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-blue-300" />
          <span>Help us understand your journey</span>
        </div>
        <MultiSelect
          options={separationSituationOptions}
          selectedValues={profileData.separationSituation || []}
          onToggle={(value) => handleMultiSelect('separationSituation', value)}
        />
      </QuestionCardSimple>

      {/* Dating Readiness */}
      {(profileData.separationSituation?.length) && (
        <QuestionCardSimple 
          questionId="question-dating-readiness"
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            Where are you at with dating/relationships? <span className="text-red-400">*</span>
            <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-purple-300" />
            <span>We want to support you wherever you are</span>
          </div>
          <MultiSelect
            options={datingReadinessOptions}
            selectedValues={profileData.datingReadiness || []}
            onToggle={(value) => handleMultiSelect('datingReadiness', value)}
          />
        </QuestionCardSimple>
      )}
    </>
  );
};

export default SeparatedDivorcedQuestions;
