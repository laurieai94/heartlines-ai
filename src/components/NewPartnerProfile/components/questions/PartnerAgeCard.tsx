import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_AGE_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerAgeCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerAgeCard = ({ profileData, updateField, isComplete = false }: PartnerAgeCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-age-question";
  
  return (
    <QuestionCard 
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's their age?
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-3 h-3 text-orange-300" />
        <p className="text-white/70 text-xs">
          Different stages = different relationship vibes
        </p>
      </div>
      <SingleSelect
        options={PARTNER_AGE_OPTIONS}
        selectedValue={profileData.partnerAge}
        onSelect={(value) => updateField('partnerAge', value)}
        columns={3}
      />
    </QuestionCard>
  );
};

export default PartnerAgeCard;