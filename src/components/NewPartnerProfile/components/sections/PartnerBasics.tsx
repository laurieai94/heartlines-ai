import { PartnerProfileData } from "../../types";
import PartnerNameCard from "../questions/PartnerNameCard";
import PartnerPronounsCard from "../questions/PartnerPronounsCard";
import PartnerAgeCard from "../questions/PartnerAgeCard";
import PartnerOrientationCard from "../questions/PartnerOrientationCard";
import PartnerGenderCard from "../questions/PartnerGenderCard";

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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">The Basics</h2>
        <p className="text-white/70">Let's start with the fundamentals about your partner</p>
      </div>

      <PartnerNameCard
        profileData={profileData}
        updateField={updateField}
      />

      <PartnerPronounsCard
        profileData={profileData}
        updateField={updateField}
      />

      <PartnerAgeCard
        profileData={profileData}
        updateField={updateField}
      />

      <PartnerOrientationCard
        profileData={profileData}
        updateField={updateField}
      />

      <PartnerGenderCard
        profileData={profileData}
        updateField={updateField}
      />
    </div>
  );
};

export default PartnerBasics;