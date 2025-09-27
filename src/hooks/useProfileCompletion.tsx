
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
    console.log('ProfileBuilder - Personal profile completion:', completion, '% - Data shape:', Object.keys(personalData));
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!partnerReady) return 0;
    
    if (!partnerData || Object.keys(partnerData).length === 0) return 0;
    
    const completion = calculatePartnerProgress(partnerData as any);
    console.log('ProfileBuilder - Partner profile completion:', completion, '% - Data shape:', Object.keys(partnerData));
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};
