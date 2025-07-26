import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_ORIENTATION_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerOrientationCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerOrientationCard = ({ profileData, updateField, isComplete = false }: PartnerOrientationCardProps) => {
  const { scrollToNextQuestion } = useAutoScroll();
  const questionId = "partner-orientation-question";
  
  return (
    <QuestionCard 
      className="space-y-4"
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What's their sexual orientation?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Because who we love shapes how we show up
        </p>
        <SingleSelect
          options={PARTNER_ORIENTATION_OPTIONS}
          selectedValue={profileData.partnerOrientation}
          onSelect={(value) => updateField('partnerOrientation', value)}
          columns={3}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerOrientationCard;