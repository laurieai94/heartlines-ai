import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/new-personal-questionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_HEARTBREAK_BETRAYAL_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/new-personal-questionnaire/hooks/useAutoScroll";

interface PartnerHeartbreakBetrayalCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}

const PartnerHeartbreakBetrayalCard = ({ profileData, handleMultiSelect, isComplete = false }: PartnerHeartbreakBetrayalCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-heartbreak-betrayal-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        have they been through any major heartbreaks or betrayals? <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Shield className="w-3 h-3 text-green-300" />
        <p className="text-white/70 text-xs">
          past pain shapes how we protect ourselves.
        </p>
      </div>
      <MultiSelect
        options={PARTNER_HEARTBREAK_BETRAYAL_OPTIONS}
        selectedValues={profileData.partnerHeartbreakBetrayal || []}
        onToggle={(value) => handleMultiSelect('partnerHeartbreakBetrayal', value)}
      />
    </QuestionCard>
  );
};

export default PartnerHeartbreakBetrayalCard;