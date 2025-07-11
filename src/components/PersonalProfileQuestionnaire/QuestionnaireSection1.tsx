
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MessageCircle, Heart, Info, Users, User } from "lucide-react";
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
    <div className="space-y-1.5">
      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5 space-y-1.5">
        <div className="grid md:grid-cols-2 gap-1.5">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-white">
              Add a profile pic <span className="text-white/60 text-xs font-normal">(optional)</span>
            </Label>
            <PhotoUpload
              profilePhoto={profileData.profilePhoto || ''}
              name={profileData.name || ''}
              onPhotoUpdate={(photo) => updateField('profilePhoto', photo)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-semibold text-white">
                What should we call you? <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={profileData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your name"
                className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 h-7 font-medium"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-white">
                Pronouns <span className="text-red-400">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {['She/her', 'He/him', 'They/them'].map((pronouns) => (
                  <button
                    key={pronouns}
                    onClick={() => updateField('pronouns', pronouns)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                      profileData.pronouns === pronouns
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {pronouns}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {['Ze/zir', 'Use my name', 'Multiple sets', 'Other'].map((pronouns) => (
                  <button
                    key={pronouns}
                    onClick={() => updateField('pronouns', pronouns)}
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                      profileData.pronouns === pronouns || (pronouns === 'Other' && profileData.pronouns && !['She/her', 'He/him', 'They/them', 'Ze/zir', 'Multiple sets', 'Use my name'].includes(profileData.pronouns))
                        ? 'questionnaire-button-selected'
                        : 'questionnaire-button-secondary'
                    }`}
                  >
                    {pronouns}
                  </button>
                ))}
              </div>
              
              {(profileData.pronouns === 'Other' || (profileData.pronouns && !['She/her', 'He/him', 'They/them', 'Ze/zir', 'Multiple sets', 'Use my name'].includes(profileData.pronouns))) && (
                <div className="mt-1">
                  <Input
                    value={profileData.pronouns && !['She/her', 'He/him', 'They/them', 'Ze/zir', 'Multiple sets', 'Use my name'].includes(profileData.pronouns) ? profileData.pronouns : ''}
                    onChange={(e) => updateField('pronouns', e.target.value)}
                    placeholder="e.g., xe/xir, fae/faer"
                    className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-xs p-1.5 h-7"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AgeSelection 
        selectedAge={profileData.age || ''}
        onAgeSelect={handleAgeSelect}
      />

      <OrientationSelection
        selectedOrientations={profileData.orientation || []}
        selfDescribe={profileData.orientationSelfDescribe || ''}
        onOrientationSelect={(orientation) => handleMultiSelect('orientation', orientation)}
        onSelfDescribeChange={(value) => updateField('orientationSelfDescribe', value)}
      />

      <GenderSelection
        selectedGenders={profileData.gender || []}
        selfDescribe={profileData.genderSelfDescribe || ''}
        onGenderSelect={(gender) => handleMultiSelect('gender', gender)}
        onSelfDescribeChange={(value) => updateField('genderSelfDescribe', value)}
      />
    </div>
  );
};

export default QuestionnaireSection1;
