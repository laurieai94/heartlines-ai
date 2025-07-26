import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_ATTACHMENT_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerAttachmentCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerAttachmentCard = ({ profileData, updateField, isComplete = false }: PartnerAttachmentCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-attachment-question";
  
  return (
    <QuestionCard 
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What's their attachment style (from what you can tell)?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          The psychological patterns that run their relationships
        </p>
        <SingleSelect
          options={PARTNER_ATTACHMENT_OPTIONS}
          selectedValue={profileData.partnerAttachmentStyle}
          onSelect={(value) => updateField('partnerAttachmentStyle', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerAttachmentCard;