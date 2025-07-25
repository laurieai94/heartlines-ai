import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_PRONOUNS_OPTIONS } from "../../constants";

interface PartnerPronounsCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
}

const PartnerPronounsCard = ({ profileData, updateField }: PartnerPronounsCardProps) => {
  return (
    <QuestionCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What pronouns do they use? <span className="text-rose-400">*</span>
        </h3>
        <p className="text-white/70 text-sm mb-4">
          So we refer to them right.
        </p>
        <SingleSelect
          options={PARTNER_PRONOUNS_OPTIONS}
          selectedValue={profileData.partnerPronouns}
          onSelect={(value) => updateField('partnerPronouns', value)}
          columns={2}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerPronounsCard;