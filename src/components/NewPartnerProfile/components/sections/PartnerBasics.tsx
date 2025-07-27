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
      {/* Flexibility Message */}
      <div className="bg-gradient-to-r from-purple-500/10 via-rose-500/10 to-orange-500/10 backdrop-blur-lg rounded-lg border border-gradient-to-r from-purple-400/30 via-rose-400/30 to-orange-400/30 p-3 mb-4 hover:from-purple-500/15 hover:via-rose-500/15 hover:to-orange-500/15 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          <p className="text-xs text-white font-medium drop-shadow-sm">Half-crush, full-on partner, or undefined? This profile flexes to wherever you're at. Everything is optional.</p>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">The Basics</h2>
        </div>
        <p className="text-white/70">stuff you'd put in a dating app</p>
      </div>

      <PartnerNamePronounsCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerName && !!profileData.partnerPronouns} />

      <PartnerAgeCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerAge} />

      <PartnerOrientationCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerOrientation} />

      <PartnerGenderCard profileData={profileData} handleMultiSelect={handleMultiSelect} isComplete={!!profileData.partnerGender?.length} />
    </div>;
};
export default PartnerBasics;