import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_SELF_AWARENESS_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerSelfAwarenessCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerSelfAwarenessCard = ({ profileData, updateField, isComplete = false }: PartnerSelfAwarenessCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-self-awareness-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        How self-aware are they about their relationship patterns?
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Brain className="w-3 h-3 text-blue-300" />
        <p className="text-white/70 text-xs">
          Be honest — growth isn't always linear.
        </p>
      </div>
      <SingleSelect
        options={PARTNER_SELF_AWARENESS_OPTIONS}
        selectedValue={profileData.partnerSelfAwareness}
        onSelect={(value) => updateField('partnerSelfAwareness', value)}
      />
    </QuestionCard>
  );
};

export default PartnerSelfAwarenessCard;