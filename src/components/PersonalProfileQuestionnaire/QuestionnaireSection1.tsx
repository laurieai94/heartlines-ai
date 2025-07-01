
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import PhotoUpload from "./PhotoUpload";
import UnderageModal from "./UnderageModal";
import AgeSelection from "./AgeSelection";
import GenderSelection from "./GenderSelection";
import OrientationSelection from "./OrientationSelection";

interface QuestionnaireSection1Props {
  profileData: any;
  updateField: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
  isReady: boolean;
}

const QuestionnaireSection1 = ({ profileData, updateField, handleMultiSelect, isReady }: QuestionnaireSection1Props) => {
  const [showUnderageModal, setShowUnderageModal] = useState(false);

  if (!isReady) return null;

  const handleAgeSelect = (age: string) => {
    if (age === 'Under 18') {
      setShowUnderageModal(true);
      return;
    }
    updateField('age', age);
  };

  return (
    <div className="space-y-6">
      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Add profile photo <span className="text-gray-500 font-normal">(Optional)</span>
          </Label>
          <PhotoUpload
            profilePhoto={profileData.profilePhoto || ''}
            name={profileData.name || ''}
            onPhotoUpdate={(photo) => updateField('profilePhoto', photo)}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            What should we call you? <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            value={profileData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Your name"
            className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
      </div>

      <AgeSelection 
        selectedAge={profileData.age || ''}
        onAgeSelect={handleAgeSelect}
      />

      <GenderSelection
        selectedGenders={profileData.gender || []}
        selfDescribe={profileData.genderSelfDescribe || ''}
        onGenderSelect={(gender) => handleMultiSelect('gender', gender)}
        onSelfDescribeChange={(value) => updateField('genderSelfDescribe', value)}
      />

      <OrientationSelection
        selectedOrientations={profileData.orientation || []}
        selfDescribe={profileData.orientationSelfDescribe || ''}
        onOrientationSelect={(orientation) => handleMultiSelect('orientation', orientation)}
        onSelfDescribeChange={(value) => updateField('orientationSelfDescribe', value)}
      />
    </div>
  );
};

export default QuestionnaireSection1;
