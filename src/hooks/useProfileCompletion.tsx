
import { usePersonalProfileData } from './usePersonalProfileData';
import { usePartnerProfileData } from './usePartnerProfileData';
import type { PersonalProfileV2, PartnerProfileV2 } from './useProfileStoreV2';
import { calculateProgress as calculatePersonalProgress } from '@/components/NewPersonalQuestionnaire/utils/validation';
import { calculatePartnerProgress } from '@/components/NewPartnerProfile/utils/partnerValidation';

export const useProfileCompletion = () => {
  const { profileData: personalData, isReady: personalReady } = usePersonalProfileData();
  const { profileData: partnerData, isReady: partnerReady } = usePartnerProfileData();

  const calculateYourCompletion = () => {
    if (!personalReady) return 0;
    
    if (!personalData || Object.keys(personalData).length === 0) {
      return 0;
    }
    
    const completion = calculatePersonalProgress(personalData as any);
    // Only log in development mode to prevent performance issues
    if (import.meta.env.DEV && completion % 25 === 0) {
      console.log('ProfileBuilder - Personal profile completion:', completion, '%');
    }
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!partnerReady) return 0;
    
    if (!partnerData || Object.keys(partnerData).length === 0) return 0;
    
    const completion = calculatePartnerProgress(partnerData as any);
    // Only log in development mode to prevent performance issues  
    if (import.meta.env.DEV && completion % 25 === 0) {
      console.log('ProfileBuilder - Partner profile completion:', completion, '%');
    }
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};
