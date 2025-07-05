
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
    <div className="space-y-1.5">
      <PartnerNameInput
        value={profileData.partnerName || ''}
        onChange={(value) => updateField('partnerName', value)}
      />

      <PartnerAgeSelection
        selectedAge={profileData.partnerAge || ''}
        onAgeSelect={(age) => updateField('partnerAge', age)}
      />

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
  );
};

export default PartnerQuestionnaireSection1;
