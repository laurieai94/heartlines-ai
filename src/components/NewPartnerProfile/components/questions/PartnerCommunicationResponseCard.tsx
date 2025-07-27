import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_COMMUNICATION_RESPONSE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerCommunicationResponseCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerCommunicationResponseCard = ({ profileData, updateField, isComplete = false }: PartnerCommunicationResponseCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-communication-response-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        When you speak up about what you need, how do they respond? <span className="text-red-400">*</span>
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-3 h-3 text-blue-300" />
        <p className="text-white/70 text-xs">
          Think about their typical reaction to boundaries and needs.
        </p>
      </div>
      <SingleSelect
        options={PARTNER_COMMUNICATION_RESPONSE_OPTIONS}
        selectedValue={profileData.partnerCommunicationResponse}
        onSelect={(value) => updateField('partnerCommunicationResponse', value)}
        columns={2}
      />
    </QuestionCard>
  );
};

export default PartnerCommunicationResponseCard;