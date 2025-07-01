
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MessageCircle, Heart, Info, Users, User, CheckCircle2 } from "lucide-react";
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

  // Check completion status for progress indicators
  const isNameComplete = profileData.name && profileData.name.trim() !== '';
  const isPronounsComplete = profileData.pronouns && profileData.pronouns !== '';
  const isAgeComplete = profileData.age && profileData.age !== '';
  const isGenderComplete = profileData.gender && profileData.gender.length > 0;
  const isOrientationComplete = profileData.orientation && profileData.orientation.length > 0;

  return (
    <div className="space-y-6">
      <UnderageModal 
        isOpen={showUnderageModal} 
        onClose={() => setShowUnderageModal(false)} 
      />

      {/* Hero Section - Profile Setup */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 transition-all duration-300 hover:bg-white/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Profile</h3>
              <p className="text-white/70 text-sm">Start with the basics</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <Label className="text-base font-medium text-white flex items-center gap-2">
                  Add a profile pic 
                  <span className="text-white/60 text-sm font-normal">(optional)</span>
                </Label>
                <PhotoUpload
                  profilePhoto={profileData.profilePhoto || ''}
                  name={profileData.name || ''}
                  onPhotoUpdate={(photo) => updateField('profilePhoto', photo)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="name" className="text-base font-medium text-white flex items-center gap-2">
                  What should we call you? 
                  <span className="text-red-400">*</span>
                  {isNameComplete && (
                    <CheckCircle2 className="w-4 h-4 text-green-400 animate-scale-in" />
                  )}
                </Label>
                <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
                  <User className="w-4 h-4 text-blue-300" />
                  <span>So we can refer to you correctly</span>
                </div>
                <div className={`transition-all duration-300 ${!isNameComplete ? 'animate-pulse' : ''}`}>
                  <Input
                    id="name"
                    type="text"
                    value={profileData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Your name"
                    className="questionnaire-button-secondary border-0 text-white placeholder:text-gray-300 text-sm p-3 h-10 font-medium transition-all duration-200 focus:ring-2 focus:ring-purple-400/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identity Questions Flow */}
      <div className="space-y-5">
        {/* Pronouns */}
        <div className={`transition-all duration-500 ${isPronounsComplete ? 'opacity-100' : 'opacity-95'}`}>
          <div className="relative">
            {isPronounsComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            <PronounsSelection
              selectedPronouns={profileData.pronouns || ''}
              onPronounsSelect={(pronouns) => updateField('pronouns', pronouns)}
            />
          </div>
        </div>

        {/* Age */}
        <div className={`transition-all duration-500 ${isAgeComplete ? 'opacity-100' : 'opacity-95'}`}>
          <div className="relative">
            {isAgeComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            <AgeSelection 
              selectedAge={profileData.age || ''}
              onAgeSelect={handleAgeSelect}
            />
          </div>
        </div>

        {/* Gender */}
        <div className={`transition-all duration-500 ${isGenderComplete ? 'opacity-100' : 'opacity-95'}`}>
          <div className="relative">
            {isGenderComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            <GenderSelection
              selectedGenders={profileData.gender || []}
              selfDescribe={profileData.genderSelfDescribe || ''}
              onGenderSelect={(gender) => handleMultiSelect('gender', gender)}
              onSelfDescribeChange={(value) => updateField('genderSelfDescribe', value)}
            />
          </div>
        </div>

        {/* Orientation */}
        <div className={`transition-all duration-500 ${isOrientationComplete ? 'opacity-100' : 'opacity-95'}`}>
          <div className="relative">
            {isOrientationComplete && (
              <div className="absolute -top-2 -right-2 z-10">
                <CheckCircle2 className="w-6 h-6 text-green-400 bg-gray-900 rounded-full animate-scale-in" />
              </div>
            )}
            <OrientationSelection
              selectedOrientations={profileData.orientation || []}
              selfDescribe={profileData.orientationSelfDescribe || ''}
              onOrientationSelect={(orientation) => handleMultiSelect('orientation', orientation)}
              onSelfDescribeChange={(value) => updateField('orientationSelfDescribe', value)}
            />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/80">
          <span>Section 1 Progress</span>
          <span className="font-medium">
            {[isNameComplete, isPronounsComplete, isAgeComplete, isGenderComplete, isOrientationComplete].filter(Boolean).length}/5
          </span>
        </div>
        <div className="mt-2 w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${([isNameComplete, isPronounsComplete, isAgeComplete, isGenderComplete, isOrientationComplete].filter(Boolean).length / 5) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireSection1;
