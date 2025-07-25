import { User } from "lucide-react";
import { PartnerQuestionCardProps } from "../../types";
import PartnerNameCard from "../questions/PartnerNameCard";
import PartnerPronounsCard from "../questions/PartnerPronounsCard";
import PartnerAgeCard from "../questions/PartnerAgeCard";
import PartnerOrientationCard from "../questions/PartnerOrientationCard";
import PartnerGenderCard from "../questions/PartnerGenderCard";

interface PartnerBasicsProps extends PartnerQuestionCardProps {
  isReady: boolean;
}

const PartnerBasics = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerBasicsProps) => {
  if (!isReady) return null;

  return (
    <div className="space-y-6">
      {/* Essential Info Section - Most Important */}
      <div className="bg-white/15 backdrop-blur-lg rounded-xl border border-white/25 p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-rose-400" />
          <h3 className="text-xl font-semibold text-white">The Basics</h3>
        </div>
        
        <div className="space-y-6">
          <PartnerNameCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
          
          <PartnerPronounsCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
        </div>
      </div>

      {/* Optional Info Section */}
      <div className="bg-white/8 backdrop-blur-lg rounded-xl border border-white/15 p-6">
        <h3 className="text-lg font-medium text-white/90 mb-6">Optional Details</h3>
        <div className="space-y-6">
          <PartnerAgeCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />

          <PartnerOrientationCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />

          <PartnerGenderCard
            profileData={profileData}
            updateField={updateField}
            handleMultiSelect={handleMultiSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerBasics;