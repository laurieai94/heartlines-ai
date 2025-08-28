
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import type { PersonalProfileV2, PartnerProfileV2 } from './useProfileStoreV2';

export const useProfileCompletion = () => {
  const { profileData: personalData, isReady: personalReady } = usePersonalProfileData();
  const { profileData: partnerData, isReady: partnerReady } = usePartnerProfileData();

  const calculateYourCompletion = () => {
    if (!personalReady) return 0;
    
    const profileData = personalData as any; // Use any to access both canonical and legacy fields
    
    if (!profileData || Object.keys(profileData).length === 0) {
      console.log('ProfileBuilder - No profile data found:', profileData);
      return 0;
    }
    
    let completed = 0;
    let total = 8;
    
    // Log what fields we're checking vs what's in the data
    console.log('ProfileBuilder - Checking fields in data:', Object.keys(profileData));
    console.log('ProfileBuilder - Full profile data:', profileData);
    
    // Core required questions - check both canonical and legacy field names
    if (profileData?.name) {
      completed++;
      console.log('✓ name:', profileData.name);
    }
    if (profileData?.age) {
      completed++;
      console.log('✓ age:', profileData.age);
    }
    
    // Gender - check both formats and field names
    const genderValue = profileData?.gender || profileData?.genderIdentity;
    const hasGender = Array.isArray(genderValue) ? genderValue.length > 0 : !!genderValue;
    if (hasGender) {
      completed++;
      console.log('✓ gender:', genderValue);
    }
    
    // Orientation - check both formats and field names  
    const orientationValue = profileData?.orientation || profileData?.sexualOrientation;
    const hasOrientation = Array.isArray(orientationValue) ? orientationValue.length > 0 : !!orientationValue;
    if (hasOrientation) {
      completed++;
      console.log('✓ orientation:', orientationValue);
    }
    
    if (profileData?.relationshipStatus) {
      completed++;
      console.log('✓ relationshipStatus:', profileData.relationshipStatus);
    }
    
    // Stress response - check both field names
    const stressValue = profileData?.stressResponse || profileData?.stressReactions;
    if (Array.isArray(stressValue) && stressValue.length > 0) {
      completed++;
      console.log('✓ stressResponse:', stressValue);
    }
    
    // Love language - check both field names
    const loveLanguageValue = profileData?.loveLanguage || profileData?.feelLovedWhen;
    if (Array.isArray(loveLanguageValue) && loveLanguageValue.length > 0) {
      completed++;
      console.log('✓ loveLanguage:', loveLanguageValue);
    }
    
    if (profileData?.attachmentStyle) {
      completed++;
      console.log('✓ attachmentStyle:', profileData.attachmentStyle);
    }
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Your profile completion:', { completed, total, completion });
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!partnerReady) return 0;
    
    const profileData = partnerData as PartnerProfileV2;
    
    if (!profileData || Object.keys(profileData).length === 0) return 0;
    
    let completed = 0;
    let total = 7; // Updated total to match actual requirements
    
    // Core required questions from the partner questionnaire structure
    if (profileData?.partnerName) {
      completed++;
      console.log('✓ partnerName:', profileData.partnerName);
    }
    if (profileData?.partnerAge) {
      completed++;
      console.log('✓ partnerAge:', profileData.partnerAge);
    }
    if (profileData?.partnerGender?.length > 0) {
      completed++;
      console.log('✓ partnerGender:', profileData.partnerGender);
    }
    if (profileData?.partnerLoveLanguage?.length > 0) {
      completed++;
      console.log('✓ partnerLoveLanguage:', profileData.partnerLoveLanguage);
    }
    if (profileData?.partnerConflictStyle?.length > 0) {
      completed++;
      console.log('✓ partnerConflictStyle:', profileData.partnerConflictStyle);
    }
    if (profileData?.partnerHeartbreakBetrayal?.length > 0) {
      completed++;
      console.log('✓ partnerHeartbreakBetrayal:', profileData.partnerHeartbreakBetrayal);
    }
    if (profileData?.partnerAttachmentStyle) {
      completed++;
      console.log('✓ partnerAttachmentStyle:', profileData.partnerAttachmentStyle);
    }
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Partner profile completion:', { completed, total, completion, profileData });
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};
