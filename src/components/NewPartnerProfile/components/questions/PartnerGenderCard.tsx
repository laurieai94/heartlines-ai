import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_GENDER_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerGenderCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}

const PartnerGenderCard = ({ profileData, handleMultiSelect, isComplete = false }: PartnerGenderCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-gender-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's their gender identity?
      </Label>
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3 h-3 text-purple-300" />
        <p className="text-white/70 text-xs">
          We know gender isn't just a checkbox
        </p>
      </div>
      <p className="text-orange-400 text-xs mb-3">Select all that resonate</p>
      <MultiSelect
        options={PARTNER_GENDER_OPTIONS}
        selectedValues={profileData.partnerGender || []}
        onToggle={(value) => handleMultiSelect('partnerGender', value)}
        columns={3}
      />
    </QuestionCard>
  );
};

export default PartnerGenderCard;