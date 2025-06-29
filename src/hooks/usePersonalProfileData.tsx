import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfileData = () => {
  const { temporaryProfiles, temporaryDemographics, isLoaded } = useTemporaryProfile();
  
  // Get the most complete personal profile data by merging both sources
  const getPersonalProfileData = () => {
    if (!isLoaded) return {};
    
    const profileData = temporaryProfiles.your[0] || {};
    const demographicsData = temporaryDemographics.your || {};
    
    console.log('Getting personal profile data:', { profileData, demographicsData });
    
    // Merge data with demographics taking precedence, but keep profile data as fallback
    const mergedData = {
      ...profileData,
      ...demographicsData
    };
    
    console.log('Merged personal profile data:', mergedData);
    return mergedData;
  };

  // Save data to both storage locations for consistency
  const savePersonalProfileData = (newData: any) => {
    console.log('Saving personal profile data:', newData);
    
    const currentProfileData = temporaryProfiles.your[0] || {};
    const currentDemographicsData = temporaryDemographics.your || {};
    
    // Merge with existing data
    const updatedData = {
      ...currentProfileData,
      ...currentDemographicsData,
      ...newData
    };
    
    console.log('Updated personal profile data:', updatedData);
    
    // Save to both locations
    const newProfiles = {
      ...temporaryProfiles,
      your: [updatedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: updatedData
    };
    
    return { newProfiles, newDemographics };
  };

  return {
    personalProfileData: getPersonalProfileData(),
    savePersonalProfileData,
    isLoaded
  };
};
