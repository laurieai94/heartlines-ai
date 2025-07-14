
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { ProfileData } from "../../../types";
import QuestionCard from "../../shared/QuestionCard";
import MultiSelect from "../../shared/MultiSelect";
import { separationSituationOptions, datingReadinessOptions } from "./constants";

interface SeparatedDivorcedQuestionsProps {
  profileData: ProfileData;
  handleMultiSelect: (field: keyof ProfileData, value: string) => void;
  onAutoScroll?: (questionId: string) => void;
}

const SeparatedDivorcedQuestions = ({ 
  profileData, 
  handleMultiSelect, 
  onAutoScroll 
}: SeparatedDivorcedQuestionsProps) => {
  return (
    <>
      {/* Separation Situation */}
      <QuestionCard 
        questionId="question-separation-situation"
        showContinue={!!(profileData.separationSituation?.length) && !(profileData.datingReadiness?.length)}
        onContinue={() => onAutoScroll?.('question-dating-readiness')}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          What's your situation right now? <span className="text-red-400">*</span>
          <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
        </Label>
        <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
          <Heart className="w-3 h-3 text-blue-300" />
          <span>Help us understand your journey</span>
        </div>
        <MultiSelect
          options={separationSituationOptions}
          selectedValues={profileData.separationSituation || []}
          onToggle={(value) => handleMultiSelect('separationSituation', value)}
          columns={2}
        />
      </QuestionCard>

      {/* Dating Readiness */}
      {(profileData.separationSituation?.length) && (
        <QuestionCard 
          questionId="question-dating-readiness"
          showContinue={!!(profileData.datingReadiness?.length)}
          onContinue={() => onAutoScroll?.('question-section-complete')}
        >
          <Label className="text-sm font-semibold text-white mb-2 block">
            Where are you at with dating/relationships? <span className="text-red-400">*</span>
            <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
          </Label>
          <div className="flex items-center gap-2 text-xs text-white/70 font-normal mb-3">
            <Heart className="w-3 h-3 text-purple-300" />
            <span>We want to support you wherever you are</span>
          </div>
          <MultiSelect
            options={datingReadinessOptions}
            selectedValues={profileData.datingReadiness || []}
            onToggle={(value) => handleMultiSelect('datingReadiness', value)}
            columns={2}
          />
        </QuestionCard>
      )}
    </>
  );
};

export default SeparatedDivorcedQuestions;
