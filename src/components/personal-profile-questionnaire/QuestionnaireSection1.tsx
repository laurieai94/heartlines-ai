
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showMorePronouns, setShowMorePronouns] = useState(false);

  if (!isReady) return null;

  const handleAgeSelect = (age: string) => {
    if (age === 'under 18') {
      setShowUnderageModal(true);
      return;
    }
    updateField('age', age);
  };

  const generateAvatar = (name: string) => {
    return (
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
        <User className="w-8 h-8" />
      </div>
    );
  };

  const basicPronouns = ['she/her', 'he/him', 'they/them', 'ze/zir', 'use my name'];
  const morePronouns = ['multiple sets', 'other'];

  const handlePronounSelect = (pronouns: string) => {
    updateField('pronouns', pronouns);
    // If selecting "other", keep the more options expanded
    if (pronouns !== 'other') {
      setShowMorePronouns(false);
    }
  };

  return (
    <div className="space-y-1">
      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />

      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/15 p-2.5">
        <div className="flex items-center gap-6">
          {/* Avatar Circle */}
          <div className="flex-shrink-0">
            {generateAvatar(profileData.name || '')}
          </div>

          {/* Name and Pronouns in same row */}
          <div className="flex-1 flex gap-6 items-start">
            {/* Name */}
            <div className="w-72 space-y-1">
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
            
            {/* Pronouns */}
            <div className="flex-1 min-w-0 space-y-1">
              <Label className="text-sm font-semibold text-white">
                Pronouns <span className="text-red-400">*</span>
              </Label>
              
              {/* Basic pronouns - expanded set in single row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {basicPronouns.map((pronouns) => (
                  <button
                    key={pronouns}
                    onClick={() => handlePronounSelect(pronouns)}
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

              {/* More options toggle */}
              <button
                onClick={() => setShowMorePronouns(!showMorePronouns)}
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white/90 transition-colors"
              >
                {showMorePronouns ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Fewer options
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    More options...
                  </>
                )}
              </button>

              {/* Additional pronouns - collapsible */}
              {showMorePronouns && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {morePronouns.map((pronouns) => (
                    <button
                      key={pronouns}
                      onClick={() => handlePronounSelect(pronouns)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                        profileData.pronouns === pronouns || (pronouns === 'other' && profileData.pronouns && !basicPronouns.includes(profileData.pronouns) && !morePronouns.slice(0, -1).includes(profileData.pronouns))
                          ? 'questionnaire-button-selected'
                          : 'questionnaire-button-secondary'
                      }`}
                    >
                      {pronouns}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Custom pronouns input */}
              {(profileData.pronouns === 'other' || (profileData.pronouns && !basicPronouns.includes(profileData.pronouns) && !morePronouns.includes(profileData.pronouns))) && (
                <div className="mt-1">
                  <Input
                    value={profileData.pronouns && !basicPronouns.includes(profileData.pronouns) && !morePronouns.includes(profileData.pronouns) ? profileData.pronouns : ''}
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
