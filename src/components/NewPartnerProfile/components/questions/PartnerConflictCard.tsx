import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
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
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How do they usually handle conflict? Select all that resonate
        </h3>
        <p className="text-white/70 text-sm mb-4">
          How they fight determines if your relationship will make it
        </p>
        <MultiSelect
          options={PARTNER_CONFLICT_OPTIONS}
          selectedValues={profileData.partnerConflictStyle || []}
          onToggle={(value) => handleMultiSelect('partnerConflictStyle', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerConflictCard;