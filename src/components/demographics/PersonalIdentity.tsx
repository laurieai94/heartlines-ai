
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AvatarUpload from '../profile/AvatarUpload';
import { useUserProfile } from "@/hooks/useUserProfile";
import { usePersonalProfileData } from "@/hooks/usePersonalProfileData";
import BrandLoadingText from '../brand/BrandLoadingText';
import { useEffect } from "react";

interface PersonalIdentityProps {
  profileType: 'your' | 'partner';
  formData: any;
  updateFormData: (field: string, value: any) => void;
  handleMultiSelect: (field: string, value: string) => void;
}

const PersonalIdentity = ({ profileType, formData, updateFormData, handleMultiSelect }: PersonalIdentityProps) => {
  const isPersonal = profileType === 'your';
  const { updateProfile } = useUserProfile();
  const { 
    profileData, 
    isReady, 
    isSyncing, 
    lastSaved, 
    updateField, 
    updateFieldImmediate,
    handleMultiSelect: handlePersonalMultiSelect,
    flush 
  } = usePersonalProfileData();

  // Use personal profile data if this is the personal profile
  const currentData = isPersonal ? profileData : formData;
  const currentUpdateField = isPersonal ? updateField : updateFormData;
  const currentHandleMultiSelect = isPersonal ? handlePersonalMultiSelect : handleMultiSelect;

  // Flush pending updates on unmount
  useEffect(() => {
    return () => {
      if (isPersonal && flush) {
        flush();
      }
    };
  }, [isPersonal, flush]);

  const handleAvatarUpdate = async (url: string) => {
    currentUpdateField('avatar_url', url);
    
    if (isPersonal) {
      try {
        await updateProfile({ avatar_url: url });
      } catch (error) {
        console.error('Error updating profile avatar:', error);
      }
    }
  };

  const pronounOptions = [
    'she/her', 'he/him', 'they/them', 'she/they', 'he/they', 'ze/zir', 'other', 'prefer not to share'
  ];

  const ageOptions = [
    '18-22', '23-27', '28-32', '33-37', '38-42', '43-47', '48-52', '53-57', '58-62', '63+', 'prefer not to share'
  ];

  const orientationOptions = [
    'straight/heterosexual', 'gay/lesbian', 'bisexual', 'pansexual', 'queer', 'asexual', 'demisexual', 'questioning/exploring', 'other', 'prefer not to share'
  ];

  const genderOptions = [
    'woman', 'man', 'non-binary', 'genderfluid', 'transgender woman', 'transgender man', 'agender', 'two-spirit', 'other', 'prefer not to share'
  ];

  // Don't render until data is ready for personal profiles
  if (isPersonal && !isReady) {
    return (
      <div className="flex items-center justify-center py-8">
        <BrandLoadingText text="profile loading..." color="dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Upload - only for personal profile */}
      {isPersonal && (
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <AvatarUpload
              currentAvatarUrl={currentData.avatar_url}
              onAvatarUpdate={handleAvatarUpdate}
              userName={currentData.name}
            />
            <p className="text-xs text-gray-500 mt-2">Optional - add a photo to personalize your profile</p>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="name" className="text-base font-medium">
            What should we call {isPersonal ? 'you' : 'them'}?
            {isPersonal && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        <Input
          id="name"
          value={currentData.name || ''}
          onChange={(e) => currentUpdateField('name', e.target.value)}
          onBlur={(e) => {
            if (isPersonal && updateFieldImmediate && e.target.value !== profileData.name) {
              updateFieldImmediate('name', e.target.value);
            }
          }}
          placeholder={isPersonal ? "Enter your name or preferred name" : "Enter their name or preferred name"}
          className="mt-1"
        />
      </div>

      {/* Pronouns */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-base font-medium">
            Pronouns
            {isPersonal && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pronounOptions.map((pronoun) => (
            <div key={pronoun} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`pronoun-${pronoun}-${profileType}`}
                name={`pronouns-${profileType}`}
                value={pronoun}
                checked={currentData.pronouns === pronoun}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isPersonal && updateFieldImmediate) {
                    updateFieldImmediate('pronouns', value);
                  } else {
                    currentUpdateField('pronouns', value);
                  }
                }}
                className="w-4 h-4 text-orange-500"
              />
              <Label htmlFor={`pronoun-${pronoun}-${profileType}`} className="text-sm">
                {pronoun}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Age Range
          {isPersonal && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ageOptions.map((age) => (
            <div key={age} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`age-${age}-${profileType}`}
                name={`age-${profileType}`}
                value={age}
                checked={currentData.age === age}
                onChange={(e) => currentUpdateField('age', e.target.value)}
                className="w-4 h-4 text-orange-500"
              />
              <Label htmlFor={`age-${age}-${profileType}`} className="text-sm">
                {age}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sexual Orientation */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Sexual Orientation
          {isPersonal && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {orientationOptions.map((orientation) => (
            <div key={orientation} className="flex items-center space-x-2">
              <Checkbox
                id={`orientation-${orientation}-${profileType}`}
                checked={currentData.orientation?.includes(orientation) || currentData.sexualOrientation?.includes(orientation) || false}
                onCheckedChange={() => currentHandleMultiSelect('orientation', orientation)}
              />
              <Label htmlFor={`orientation-${orientation}-${profileType}`} className="text-sm">
                {orientation}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Identity */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Gender Identity
          {isPersonal && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {genderOptions.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}-${profileType}`}
                checked={currentData.gender?.includes(gender) || currentData.genderIdentity?.includes(gender) || false}
                onCheckedChange={() => currentHandleMultiSelect('gender', gender)}
              />
              <Label htmlFor={`gender-${gender}-${profileType}`} className="text-sm">
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
