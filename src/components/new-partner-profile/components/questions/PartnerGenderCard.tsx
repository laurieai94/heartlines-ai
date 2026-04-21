import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/new-personal-questionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_GENDER_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/new-personal-questionnaire/hooks/useAutoScroll";

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
    >
      <div className="mb-2">
        <Label className="text-sm font-semibold text-white">
          what's their gender identity? <span className="hidden sm:inline text-orange-400 text-xs font-normal">select all that resonate</span>
        </Label>
      </div>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <User className="w-3 h-3 text-purple-300" />
        <p className="text-white/70 text-xs">
          we know gender isn't just a checkbox
        </p>
      </div>
      <MultiSelect
        options={PARTNER_GENDER_OPTIONS}
        selectedValues={profileData.partnerGender || []}
        onToggle={(value) => handleMultiSelect('partnerGender', value)}
      />
    </QuestionCard>
  );
};

export default PartnerGenderCard;