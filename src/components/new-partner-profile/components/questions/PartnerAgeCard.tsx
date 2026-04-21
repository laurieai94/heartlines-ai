import { useState } from "react";
import QuestionCard from "@/components/new-personal-questionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/new-personal-questionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_AGE_OPTIONS } from "../../constants";
import { usePartnerFlow } from "../../context/FlowContext";
import UnderageModal from "@/components/personal-profile-questionnaire/UnderageModal";

interface PartnerAgeCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
}

const PartnerAgeCard = ({ profileData, updateField, isComplete = false }: PartnerAgeCardProps) => {
  const [showUnderageModal, setShowUnderageModal] = useState(false);
  const { goToNext } = usePartnerFlow();
  const questionId = "partner-age-question";
  
  const handleAgeSelect = (value: string) => {
    if (value === 'Under 18') {
      setShowUnderageModal(true);
      return;
    }
    updateField('partnerAge', value);
  };
  
  return (
    <>
      <QuestionCard 
        questionId={questionId}
      >
        <Label className="text-sm font-semibold text-white mb-2 block">
          what's their age?
        </Label>
        <div className="hidden sm:flex items-center gap-2 mb-3">
          <Calendar className="w-3 h-3 text-orange-300" />
          <p className="text-white/70 text-xs">
            different stages = different relationship vibes
          </p>
        </div>
        <SingleSelect
          options={PARTNER_AGE_OPTIONS}
          selectedValue={profileData.partnerAge}
          onSelect={handleAgeSelect}
        />
      </QuestionCard>
      
      <UnderageModal 
        isOpen={showUnderageModal}
        onClose={() => setShowUnderageModal(false)}
      />
    </>
  );
};

export default PartnerAgeCard;