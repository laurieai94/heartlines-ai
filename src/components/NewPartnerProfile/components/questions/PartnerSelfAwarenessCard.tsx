import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_SELF_AWARENESS_OPTIONS } from "../../constants";

interface PartnerSelfAwarenessCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
}

const PartnerSelfAwarenessCard = ({ profileData, updateField }: PartnerSelfAwarenessCardProps) => {
  return (
    <QuestionCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How self-aware are they about their relationship patterns?
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Be honest — growth isn't always linear.
        </p>
        <SingleSelect
          options={PARTNER_SELF_AWARENESS_OPTIONS}
          selectedValue={profileData.partnerSelfAwareness}
          onSelect={(value) => updateField('partnerSelfAwareness', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerSelfAwarenessCard;