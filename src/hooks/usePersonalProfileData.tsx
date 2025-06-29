
import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfileData = () => {
  const { temporaryProfiles, temporaryDemographics, isLoaded } = useTemporaryProfile();
  
  // Merge all existing personal profile data from both sources
  const getPersonalProfileData = () => {
    if (!isLoaded) return {};
    
    const existingProfile = temporaryProfiles.your[0] || {};
    const existingDemographics = temporaryDemographics.your || {};
    
    // Merge all data sources
    return {
      ...existingProfile,
      ...existingDemographics
    };
  };

  return {
    personalProfileData: getPersonalProfileData(),
    isLoaded
  };
};
