import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { PartnerProfileData } from "../../types";
import { PARTNER_ATTACHMENT_OPTIONS } from "../../constants";
import { useAutoScroll } from "@/components/NewPersonalQuestionnaire/hooks/useAutoScroll";

interface PartnerAttachmentCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  isComplete?: boolean;
  onSectionComplete?: () => void;
}

const PartnerAttachmentCard = ({ profileData, updateField, isComplete = false, onSectionComplete }: PartnerAttachmentCardProps) => {
  const questionId = "partner-attachment-question";
  const cardIsComplete = !!profileData.partnerAttachmentStyle;
  
    return (
    <QuestionCard 
      questionId={questionId}
    >
      <Label className="text-sm font-semibold text-white mb-2 block">
        what's their attachment style (from what you can tell)? <span className="text-red-400">*</span>
      </Label>
      <div className="hidden sm:flex items-center gap-2 mb-3">
        <Heart className="w-3 h-3 text-red-300" />
        <p className="text-white/70 text-xs">
          the psychological patterns that run their relationships
        </p>
      </div>
      <SingleSelect
        options={PARTNER_ATTACHMENT_OPTIONS}
        selectedValue={profileData.partnerAttachmentStyle}
        onSelect={(value) => updateField('partnerAttachmentStyle', value)}
      />
    </QuestionCard>
  );
};

export default PartnerAttachmentCard;