
import { User } from "lucide-react";
import PartnerNameInput from "./PartnerNameInput";
import PartnerAgeSelection from "./PartnerAgeSelection";
import PartnerPronounsSelection from "./PartnerPronounsSelection";
import PartnerGenderSelection from "./PartnerGenderSelection";
import PartnerOrientationSelection from "./PartnerOrientationSelection";

interface PartnerQuestionnaireSection1Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const PartnerQuestionnaireSection1 = ({ 
  profileData, 
  updateField, 
  handleMultiSelect, 
  isReady 
}: PartnerQuestionnaireSection1Props) => {
  if (!isReady) return null;

  return (
    <div className="space-y-3">
      {/* Essential Info Section - Most Important */}
      <div className="bg-white/15 backdrop-blur-lg rounded-xl border border-white/25 p-4 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-rose-400" />
          <h3 className="text-base font-semibold text-white">Essential Info</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:max-w-xs flex-none">
            <PartnerNameInput
              value={profileData.partnerName || ''}
              onChange={(value) => updateField('partnerName', value)}
            />
          </div>
          <div className="flex-1">
            <PartnerAgeSelection
              selectedAge={profileData.partnerAge || ''}
              onAgeSelect={(age) => updateField('partnerAge', age)}
            />
          </div>
        </div>
      </div>

      {/* Identity Info Section - Secondary */}
      <div className="bg-white/8 backdrop-blur-lg rounded-xl border border-white/15 p-3 space-y-3">
        <h3 className="text-sm font-medium text-white/90 mb-2">Identity & Personal Info</h3>
        <div className="space-y-3">
          <PartnerPronounsSelection
            selectedPronouns={profileData.partnerPronouns || ''}
            onPronounsSelect={(pronouns) => updateField('partnerPronouns', pronouns)}
          />

          <PartnerGenderSelection
            selectedGenders={profileData.partnerGender || []}
            selfDescribe={profileData.partnerGenderSelfDescribe || ''}
            onGenderSelect={(gender) => handleMultiSelect('partnerGender', gender)}
            onSelfDescribeChange={(value) => updateField('partnerGenderSelfDescribe', value)}
          />

          <PartnerOrientationSelection
            selectedOrientations={profileData.partnerOrientation || []}
            selfDescribe={profileData.partnerOrientationSelfDescribe || ''}
            onOrientationSelect={(orientation) => handleMultiSelect('partnerOrientation', orientation)}
            onSelfDescribeChange={(value) => updateField('partnerOrientationSelfDescribe', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection1;
