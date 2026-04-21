import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/new-personal-questionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Compass } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_ORIENTATION_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/new-personal-questionnaire/hooks/useAutoScroll";

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
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what's their sexual orientation?
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Compass className="w-3 h-3 text-pink-300" />
        <p className="text-white/70 text-xs">
          because who we love shapes how we show up
        </p>
      </div>
      <SingleSelect
        options={PARTNER_ORIENTATION_OPTIONS}
        selectedValue={profileData.partnerOrientation}
        onSelect={(value) => updateField('partnerOrientation', value)}
      />
    </QuestionCard>
  );
};

export default PartnerOrientationCard;