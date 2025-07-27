import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
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
      questionId={questionId}
      showContinue={isComplete}
      onContinue={() => scrollToNextQuestion(questionId)}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        What's their sexual orientation?
      </Label>
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-3 h-3 text-pink-300" />
        <p className="text-white/70 text-xs">
          Because who we love shapes how we show up
        </p>
      </div>
      <SingleSelect
        options={PARTNER_ORIENTATION_OPTIONS}
        selectedValue={profileData.partnerOrientation}
        onSelect={(value) => updateField('partnerOrientation', value)}
        columns={3}
      />
    </QuestionCard>
  );
};

export default PartnerOrientationCard;