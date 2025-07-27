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
      <div className="relative bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-white">Flexible by Design</h3>
          </div>
          <p className="text-white/80 leading-relaxed max-w-md mx-auto">
            Half-crush, full-on partner, or undefined? This profile flexes to wherever you're at.
          </p>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <User className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold text-white">The Basics</h2>
        </div>
        <p className="text-white/70">The stats they put in their dating profile</p>
      </div>

      <PartnerNamePronounsCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerName && !!profileData.partnerPronouns} />

      <PartnerAgeCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerAge} />

      <PartnerOrientationCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerOrientation} />

      <PartnerGenderCard profileData={profileData} updateField={updateField} isComplete={!!profileData.partnerGender} />
    </div>;
};
export default PartnerBasics;