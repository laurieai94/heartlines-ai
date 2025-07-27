import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_COMMUNICATION_RESPONSE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";
interface PartnerCommunicationResponseCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isComplete?: boolean;
}
const PartnerCommunicationResponseCard = ({
  profileData,
  handleMultiSelect,
  isComplete = false
}: PartnerCommunicationResponseCardProps) => {
  const {
    scrollToNextQuestion
  } = useAutoScroll();
  const questionId = "partner-communication-response-question";
  return <QuestionCard questionId={questionId} showContinue={isComplete} onContinue={() => scrollToNextQuestion(questionId)}>
      <Label className="text-sm font-semibold text-white mb-2 block">
        When you speak up about what you need, how do they typically respond?
        <span className="text-orange-300 font-medium text-xs ml-2">Select all that resonate</span>
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-3 h-3 text-blue-300" />
        <p className="text-white/70 text-xs">Think about their typical reaction to boundaries and needs.</p>
      </div>
      <MultiSelect options={PARTNER_COMMUNICATION_RESPONSE_OPTIONS} selectedValues={profileData.partnerCommunicationResponse} onToggle={value => handleMultiSelect('partnerCommunicationResponse', value)} columns={2} />
    </QuestionCard>;
};
export default PartnerCommunicationResponseCard;