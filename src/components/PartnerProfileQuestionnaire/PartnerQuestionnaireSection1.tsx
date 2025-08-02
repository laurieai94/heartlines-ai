
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
    <div className="space-y-4 animate-fade-in">
      {/* Essential Info Section - Most Important */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl border border-white/25 p-5 space-y-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">Essential Info</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:max-w-sm flex-none">
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
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-5 space-y-4 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/12">
        <h3 className="text-base font-semibold text-white/95 mb-3 tracking-wide">Identity & Personal Info</h3>
        <div className="space-y-4">
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <PartnerPronounsSelection
              selectedPronouns={profileData.partnerPronouns || ''}
              onPronounsSelect={(pronouns) => updateField('partnerPronouns', pronouns)}
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <PartnerGenderSelection
              selectedGenders={profileData.partnerGender || []}
              selfDescribe={profileData.partnerGenderSelfDescribe || ''}
              onGenderSelect={(gender) => handleMultiSelect('partnerGender', gender)}
              onSelfDescribeChange={(value) => updateField('partnerGenderSelfDescribe', value)}
            />
          </div>

          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <PartnerOrientationSelection
              selectedOrientations={profileData.partnerOrientation || []}
              selfDescribe={profileData.partnerOrientationSelfDescribe || ''}
              onOrientationSelect={(orientation) => handleMultiSelect('partnerOrientation', orientation)}
              onSelfDescribeChange={(value) => updateField('partnerOrientationSelfDescribe', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerQuestionnaireSection1;
