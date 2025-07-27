import { User, Sparkles } from "lucide-react";
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
  return <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">The Basics</h2>
        </div>
        <p className="text-white/70">The stats you'd put in a dating profile</p>
      </div>

      {/* Flexibility Message */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/15 p-4 mb-6">
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <p className="text-sm text-white/70 text-center">
            Half-crush, full-on partner, or undefined? This profile flexes to wherever you're at.
          </p>
        </div>
      </div>

      <PartnerNamePronounsCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerName && !!profileData.partnerPronouns} />

      <PartnerAgeCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerAge} />

      <PartnerOrientationCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerOrientation} />

      <PartnerGenderCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerGender} />
    </div>;
};
export default PartnerBasics;