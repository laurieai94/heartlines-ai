
import { PartnerProfileData } from "../../types";
import PartnerNamePronounsCard from "../questions/PartnerNamePronounsCard";
import PartnerAgeCard from "../questions/PartnerAgeCard";
import PartnerOrientationCard from "../questions/PartnerOrientationCard";
import PartnerGenderCard from "../questions/PartnerGenderCard";
import OptionalGroup from "@/components/NewPersonalQuestionnaire/components/shared/OptionalGroup";

interface PartnerBasicsProps {
  profileData: PartnerProfileData;
  updateField: (field: keyof PartnerProfileData, value: any) => void;
  handleMultiSelect: (field: keyof PartnerProfileData, value: string) => void;
  isActive: boolean;
  onSectionComplete: () => void;
}

const PartnerBasics = ({
  profileData,
  updateField,
  handleMultiSelect,
  isActive,
  onSectionComplete
}: PartnerBasicsProps) => {
  return (
    <div className="space-y-4 transition-opacity duration-300 opacity-100">
      <PartnerNamePronounsCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerName && !!profileData.partnerPronouns} onSectionComplete={onSectionComplete} />

      <OptionalGroup 
        title="Share a few details about their vibe and your dynamic"
      >
        <PartnerAgeCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerAge} />

        <PartnerOrientationCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerOrientation} />

        <PartnerGenderCard profileData={profileData} handleMultiSelect={handleMultiSelect} isComplete={!!profileData.partnerGender?.length} />
      </OptionalGroup>
    </div>
  );
};

export default PartnerBasics;
