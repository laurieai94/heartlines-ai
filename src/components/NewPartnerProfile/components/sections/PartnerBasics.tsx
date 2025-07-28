import { User } from "lucide-react";
import { PartnerProfileData } from "../../types";
import PartnerNamePronounsCard from "../questions/PartnerNamePronounsCard";
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">The Basics</h2>
        </div>
        <p className="text-white/70">stuff they'd put in a dating app</p>
      </div>

      <PartnerNamePronounsCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerName && !!profileData.partnerPronouns} />

      <PartnerAgeCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerAge} />

      <PartnerOrientationCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerOrientation} />

      <PartnerGenderCard profileData={profileData} handleMultiSelect={handleMultiSelect} isComplete={!!profileData.partnerGender?.length} />
    </div>
  );
};
export default PartnerBasics;