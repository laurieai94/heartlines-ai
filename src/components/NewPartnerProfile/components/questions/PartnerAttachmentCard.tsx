import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_ATTACHMENT_OPTIONS } from "../../constants";

interface PartnerAttachmentCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
}

const PartnerAttachmentCard = ({ profileData, updateField }: PartnerAttachmentCardProps) => {
  return (
    <QuestionCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What's their attachment style (from what you can tell)?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          The psychological patterns that run their relationships
        </p>
        <SingleSelect
          options={PARTNER_ATTACHMENT_OPTIONS}
          selectedValue={profileData.partnerAttachmentStyle}
          onSelect={(value) => updateField('partnerAttachmentStyle', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerAttachmentCard;