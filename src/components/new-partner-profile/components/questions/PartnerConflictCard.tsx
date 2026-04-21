import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_CONFLICT_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerConflictCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}

const PartnerConflictCard = ({ profileData, handleMultiSelect, isComplete = false }: PartnerConflictCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-conflict-question";
  
  return (
        <QuestionCard 
          questionId={questionId}
        >
      <Label className="text-sm font-semibold text-white mb-2 block">
        how do they usually handle conflict? <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Shield className="w-3 h-3 text-blue-300" />
        <p className="text-white/70 text-xs">
          how they fight determines if your relationship will make it
        </p>
      </div>
      <MultiSelect
        options={PARTNER_CONFLICT_OPTIONS}
        selectedValues={profileData.partnerConflictStyle || []}
        onToggle={(value) => handleMultiSelect('partnerConflictStyle', value)}
      />
    </QuestionCard>
  );
};

export default PartnerConflictCard;