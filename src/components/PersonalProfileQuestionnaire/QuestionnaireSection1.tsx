
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import PhotoUpload from "./PhotoUpload";
import UnderageModal from "./UnderageModal";
import AgeSelection from "./AgeSelection";
import GenderSelection from "./GenderSelection";
import OrientationSelection from "./OrientationSelection";
import PronounsSelection from "./PronounsSelection";

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
    <div className="questionnaire-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />

        <div className="questionnaire-card p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-lg font-semibold questionnaire-text">
                Would you like to add a profile photo? <span className="questionnaire-text-muted font-normal">(Optional)</span>
              </Label>
              <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-4">
                <Lightbulb className="w-4 h-4" />
                <span>Helps your AI coach feel more personal (totally optional if you're not into pics)</span>
              </div>
              <PhotoUpload
                profilePhoto={profileData.profilePhoto || ''}
                name={profileData.name || ''}
                onPhotoUpdate={(photo) => updateField('profilePhoto', photo)}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="name" className="text-lg font-semibold questionnaire-text">
                What should we call you? <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2 text-sm questionnaire-text-muted mb-4">
                <Lightbulb className="w-4 h-4" />
                <span>So we can make this feel like talking to a real person, not a bot</span>
              </div>
              <Input
                id="name"
                type="text"
                value={profileData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your name"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-lg p-4"
              />
            </div>
          </div>
        </div>

      <PronounsSelection
        selectedPronouns={profileData.pronouns || ''}
        onPronounsSelect={(pronouns) => updateField('pronouns', pronouns)}
      />

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
    </div>
  );
};

export default QuestionnaireSection1;
