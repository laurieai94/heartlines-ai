import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_GENDER_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerGenderCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerGenderCard = ({ profileData, updateField, isComplete = false }: PartnerGenderCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-gender-question";
  
  return (
    <QuestionCard 
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What's their gender identity?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          We know gender isn't just a checkbox
        </p>
        <SingleSelect
          options={PARTNER_GENDER_OPTIONS}
          selectedValue={profileData.partnerGender}
          onSelect={(value) => updateField('partnerGender', value)}
          columns={3}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerGenderCard;