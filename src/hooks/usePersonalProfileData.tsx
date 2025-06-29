
import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfileData = () => {
  const { temporaryProfiles, temporaryDemographics, isLoaded } = useTemporaryProfile();
  
  // Get the most complete personal profile data by merging both sources
  const getPersonalProfileData = () => {
    if (!isLoaded) return {};
    
    const profileData = temporaryProfiles.your[0] || {};
    const demographicsData = temporaryDemographics.your || {};
    
    console.log('Getting personal profile data:', { profileData, demographicsData });
    
    // Return merged data with demographics taking precedence for most fields
    const mergedData = {
      ...profileData,
      ...demographicsData
    };
    
    console.log('Merged personal profile data:', mergedData);
    return mergedData;
  };

  return {
    personalProfileData: getPersonalProfileData(),
    isLoaded
  };
};
