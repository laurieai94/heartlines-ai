import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import MultiSelect from "@/components/NewPersonalQuestionnaire/components/shared/MultiSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_LOVE_LANGUAGE_OPTIONS } from "../../constants";

interface PartnerLoveLanguageCardProps {
  profileData: PartnerProfileData;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
}

const PartnerLoveLanguageCard = ({ profileData, handleMultiSelect }: PartnerLoveLanguageCardProps) => {
  return (
    <QuestionCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          How do they seem to feel most loved? Select all that resonate
        </h3>
        <p className="text-white/70 text-sm mb-4">
          Knowing this helps us actually know what they need
        </p>
        <MultiSelect
          options={PARTNER_LOVE_LANGUAGE_OPTIONS}
          selectedValues={profileData.partnerLoveLanguage || []}
          onToggle={(value) => handleMultiSelect('partnerLoveLanguage', value)}
          columns={1}
        />
      </div>
    </QuestionCard>
  );
};

export default PartnerLoveLanguageCard;