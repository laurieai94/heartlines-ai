import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/new-personal-questionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { Home } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_FAMILY_STRUCTURE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/new-personal-questionnaire/hooks/useAutoScroll";

interface PartnerFamilyDynamicCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}

const PartnerFamilyDynamicCard = ({ profileData, handleMultiSelect, isComplete = false }: PartnerFamilyDynamicCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-family-dynamic-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what was their family dynamic growing up? <span className="hidden sm:inline text-orange-300 font-medium text-xs ml-2">select all that resonate</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Home className="w-3 h-3 text-green-300" />
        <p className="text-white/70 text-xs">
          this literally programmed their relationship blueprints
        </p>
      </div>
      <MultiSelect
        options={PARTNER_FAMILY_STRUCTURE_OPTIONS}
        selectedValues={profileData.partnerFamilyStructure || []}
        onToggle={(value) => handleMultiSelect('partnerFamilyStructure', value)}
      />
    </QuestionCard>
  );
};

export default PartnerFamilyDynamicCard;