import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_LOVE_LANGUAGE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerLoveLanguageCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}

const PartnerLoveLanguageCard = ({ profileData, handleMultiSelect, isComplete = false }: PartnerLoveLanguageCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-love-language-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        How do they seem to feel most loved? <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-3 h-3 text-pink-300" />
        <p className="text-white/70 text-xs">
          Knowing this helps us actually know what they need
        </p>
      </div>
      <MultiSelect
        options={PARTNER_LOVE_LANGUAGE_OPTIONS}
        selectedValues={profileData.partnerLoveLanguage || []}
        onToggle={(value) => handleMultiSelect('partnerLoveLanguage', value)}
        columns={2}
      />
    </QuestionCard>
  );
};

export default PartnerLoveLanguageCard;