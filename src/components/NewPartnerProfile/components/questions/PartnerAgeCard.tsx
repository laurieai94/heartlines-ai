import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
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
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What's their age?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Different stages = different relationship vibes
        </p>
        <SingleSelect
          options={PARTNER_AGE_OPTIONS}
          selectedValue={profileData.partnerAge}
          onSelect={(value) => updateField('partnerAge', value)}
          columns={3}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerAgeCard;