
import { useTemporaryProfile } from './useTemporaryProfile';

export const useProfileCompletion = () => {
  const { temporaryProfiles, temporaryDemographics, isLoaded } = useTemporaryProfile();

  const calculateYourCompletion = () => {
    if (!isLoaded) return 0;
    
    const yourProfile = temporaryProfiles.your[0];
    const yourDemo = temporaryDemographics.your;
    
    if (!yourProfile && !yourDemo) return 0;
    
    let completed = 0;
    let total = 8;
    
    // Core required questions from the questionnaire
    if (yourDemo?.name) completed++;
    if (yourDemo?.age) completed++;
    if (yourDemo?.gender?.length > 0) completed++;
    if (yourDemo?.sexualOrientation?.length > 0) completed++;
    if (yourDemo?.relationshipStatus) completed++;
    if (yourDemo?.whyRealTalk?.length > 0) completed++;
    if (yourDemo?.biggestChallenge?.length > 0) completed++;
    if (yourDemo?.attachmentStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Your profile completion:', { completed, total, completion });
    return completion;
  };

  const calculatePartnerCompletion = () => {
    if (!isLoaded) return 0;
    
    const partnerProfile = temporaryProfiles.partner[0];
    const partnerDemo = temporaryDemographics.partner;
    
    if (!partnerProfile && !partnerDemo) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (partnerDemo?.name) completed++;
    if (partnerProfile?.communicationStyle || partnerDemo?.communicationStyle) completed++;
    if (partnerProfile?.loveLanguages?.length > 0 || partnerDemo?.loveLanguages?.length > 0) completed++;
    if (partnerProfile?.conflictStyle || partnerDemo?.conflictStyle) completed++;
    
    const completion = Math.round((completed / total) * 100);
    console.log('ProfileBuilder - Partner profile completion:', { completed, total, completion });
    return completion;
  };

  return {
    calculateYourCompletion,
    calculatePartnerCompletion
  };
};
