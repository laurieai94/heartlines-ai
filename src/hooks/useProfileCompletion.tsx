
import { useUnifiedProfileStorage } from './useUnifiedProfileStorage';

export const useProfileCompletion = () => {
  const personalStorage = useUnifiedProfileStorage('personal');
  const partnerStorage = useUnifiedProfileStorage('partner');

  const calculateYourCompletion = () => {
    if (!personalStorage.isReady) return 0;
    
    const profileData = personalStorage.profileData;
    
    if (!profileData || Object.keys(profileData).length === 0) {
      console.log('ProfileBuilder - No profile data found:', profileData);
      return 0;
    }
    
    let completed = 0;
    let total = 8;
    
    // Log what fields we're checking vs what's in the data
    console.log('ProfileBuilder - Checking fields in data:', Object.keys(profileData));
    console.log('ProfileBuilder - Full profile data:', profileData);
    
    // Core required questions from the new questionnaire structure
    if (profileData?.name) {
      completed++;
      console.log('✓ name:', profileData.name);
    }
    if (profileData?.age) {
      completed++;
      console.log('✓ age:', profileData.age);
    }
    if (profileData?.gender?.length > 0) {
      completed++;
      console.log('✓ gender:', profileData.gender);
    }
    if (profileData?.orientation?.length > 0) {
      completed++;
      console.log('✓ orientation:', profileData.orientation);
    }
    if (profileData?.relationshipStatus) {
      completed++;
      console.log('✓ relationshipStatus:', profileData.relationshipStatus);
    }
    if (profileData?.stressResponse?.length > 0) {
      completed++;
      console.log('✓ stressResponse:', profileData.stressResponse);
    }
if (profileData?.loveLanguage?.length > 0) {
  completed++;
  console.log('✓ loveLanguage:', profileData.loveLanguage);
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
    if (!partnerStorage.isReady) return 0;
    
    const profileData = partnerStorage.profileData;
    
    if (!profileData || Object.keys(profileData).length === 0) return 0;
    
    let completed = 0;
    let total = 4;
    
    // Core required questions from the new partner questionnaire structure
    if (profileData?.partnerName) {
      completed++;
      console.log('✓ partnerName:', profileData.partnerName);
    }
    if (profileData?.partnerCommunicationResponse?.length > 0) {
      completed++;
      console.log('✓ partnerCommunicationResponse:', profileData.partnerCommunicationResponse);
    }
    if (profileData?.partnerLoveLanguage?.length > 0) {
      completed++;
      console.log('✓ partnerLoveLanguage:', profileData.partnerLoveLanguage);
    }
    if (profileData?.partnerConflictStyle?.length > 0) {
      completed++;
      console.log('✓ partnerConflictStyle:', profileData.partnerConflictStyle);
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
