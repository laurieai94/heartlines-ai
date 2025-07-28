
import { useUnifiedProfileStorage } from './useUnifiedProfileStorage';

export const useProfileCompletion = () => {
  const personalStorage = useUnifiedProfileStorage('personal');
  const partnerStorage = useUnifiedProfileStorage('partner');

  const calculateYourCompletion = () => {
    if (!personalStorage.isReady) return 0;
    
    const profileData = personalStorage.profileData;
    
    if (!profileData || Object.keys(profileData).length === 0) return 0;
    
    let completed = 0;
    let total = 8;
    
    // Core required questions from the new questionnaire structure
    if (profileData?.name) completed++;
    if (profileData?.age) completed++;
    if (profileData?.gender) completed++;
    if (profileData?.orientation) completed++;
    if (profileData?.relationshipStatus) completed++;
    if (profileData?.stressResponse?.length > 0) completed++;
    if (profileData?.loveLanguage?.length > 0) completed++;
    if (profileData?.attachmentStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Your profile completion:', { completed, total, completion, profileData });
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!partnerStorage.isReady) return 0;
    
    const profileData = partnerStorage.profileData;
    
    if (!profileData || Object.keys(profileData).length === 0) return 0;
    
    let completed = 0;
    let total = 4;
    
    // Core required questions from the new partner questionnaire structure
    if (profileData?.partnerName) completed++;
    if (profileData?.partnerCommunicationResponse?.length > 0) completed++;
    if (profileData?.partnerLoveLanguage?.length > 0) completed++;
    if (profileData?.partnerConflictStyle?.length > 0) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Partner profile completion:', { completed, total, completion, profileData });
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};
