import QuestionCard from "@/components/NewPersonalQuestionnaire/components/shared/QuestionCard";
import SingleSelect from "@/components/NewPersonalQuestionnaire/components/shared/SingleSelect";
import { PartnerProfileData } from "../../types";
import { PARTNER_ORIENTATION_OPTIONS } from "../../constants";

interface PartnerOrientationCardProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
}

const PartnerOrientationCard = ({ profileData, updateField }: PartnerOrientationCardProps) => {
  return (
    <QuestionCard className="space-y-4">
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