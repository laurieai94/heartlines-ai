import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_FAMILY_STRUCTURE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

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
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What was their family dynamic growing up? Select all that resonate
        </h3>
        <p className="text-white/70 text-sm mb-4">
          This literally programmed their relationship blueprints
        </p>
        <MultiSelect
          options={PARTNER_FAMILY_STRUCTURE_OPTIONS}
          selectedValues={profileData.partnerFamilyStructure || []}
          onToggle={(value) => handleMultiSelect('partnerFamilyStructure', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerFamilyDynamicCard;