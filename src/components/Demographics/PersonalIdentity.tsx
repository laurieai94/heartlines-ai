
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AvatarUpload from "../AvatarUpload";
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import { useState, useEffect } from "react";

interface PersonalIdentityProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const PersonalIdentity = ({ profileType, formData, updateFormData, handleMultiSelect }: PersonalIdentityProps) => {
  const isPersonal = profileType === 'your';
  const { updateProfile } = useUserProfile();
  const { personalProfileData, isLoaded } = usePersonalProfileData();

  // Load existing data when component mounts or when profile data changes
  useEffect(() => {
    if (isPersonal && isLoaded && personalProfileData && Object.keys(personalProfileData).length > 0) {
      console.log('PersonalIdentity: Loading existing personal data:', personalProfileData);
      
      // Update form data with existing values, but only if the form field is empty
      Object.keys(personalProfileData).forEach(key => {
        const existingValue = personalProfileData[key];
        const currentValue = formData[key];
        
        if (existingValue && (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0))) {
          console.log(`PersonalIdentity: Setting ${key} to`, existingValue);
          updateFormData(key, existingValue);
        }
      });
    }
  }, [isPersonal, isLoaded, personalProfileData]);

  const handleAvatarUpdate = async (url: string) => {
    updateFormData('avatar_url', url);
    
    // If this is the personal profile, also update the user profile
    if (isPersonal) {
      try {
        await updateProfile({ avatar_url: url });
      } catch (error) {
        console.error('Error updating profile avatar:', error);
      }
    }
  };

  const pronounOptions = [
    'she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'ze/zir', 'Other', 'Prefer not to share'
  ];

  const ageOptions = [
    '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-57', '58-62', '63+', 'Prefer not to share'
  ];

  const orientationOptions = [
    'Straight/Heterosexual', 'Gay/Lesbian', 'Bisexual', 'Pansexual', 'Queer', 'Asexual', 'Demisexual', 'Questioning/Exploring', 'Other', 'Prefer not to share'
  ];

  const genderOptions = [
    'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Transgender woman', 'Transgender man', 'Agender', 'Two-Spirit', 'Other', 'Prefer not to share'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        About {isPersonal ? 'You' : 'Your Partner'}
        {isPersonal && <span className="text-red-500 text-sm">*Required</span>}
      </h3>

      {/* Avatar Upload - only for personal profile and now optional */}
      {isPersonal && (
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <AvatarUpload
              currentAvatarUrl={formData.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userName={formData.name}
            />
            <p className="text-xs text-gray-500 mt-2">Optional - add a photo to personalize your profile</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-base font-medium">
          What should we call {isPersonal ? 'you' : 'them'}? {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter name or preferred name"
          className="mt-1"
        />
      </div>

      {/* Pronouns */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Pronouns {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pronounOptions.map((pronoun) => (
            <div key={pronoun} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`pronoun-${pronoun}`}
                name="pronouns"
                value={pronoun}
                checked={formData.pronouns === pronoun}
                onChange={(e) => updateFormData('pronouns', e.target.value)}
                className="w-4 h-4 text-pink-600"
              />
              <Label htmlFor={`pronoun-${pronoun}`} className="text-sm">
                {pronoun}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Age Range {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ageOptions.map((age) => (
            <div key={age} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`age-${age}`}
                name="age"
                value={age}
                checked={formData.age === age}
                onChange={(e) => updateFormData('age', e.target.value)}
                className="w-4 h-4 text-pink-600"
              />
              <Label htmlFor={`age-${age}`} className="text-sm">
                {age}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sexual Orientation - Now Required */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Sexual Orientation {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orientationOptions.map((orientation) => (
            <div key={orientation} className="flex items-center space-x-2">
              <Checkbox
                id={`orientation-${orientation}`}
                checked={formData.sexualOrientation?.includes(orientation) || false}
                onCheckedChange={() => handleMultiSelect('sexualOrientation', orientation)}
              />
              <Label htmlFor={`orientation-${orientation}`} className="text-sm">
                {orientation}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Identity - Now Required */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Gender Identity {isPersonal && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {genderOptions.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={formData.genderIdentity?.includes(gender) || false}
                onCheckedChange={() => handleMultiSelect('genderIdentity', gender)}
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalIdentity;
