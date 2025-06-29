
import { useState, useEffect } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfileData = () => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile, isLoaded } = useTemporaryProfile();
  
  // Initialize with empty state
  const [profileData, setProfileData] = useState({});
  const [isReady, setIsReady] = useState(false);

  // Load existing data when temporary profile is loaded
  useEffect(() => {
    if (isLoaded) {
      const existingProfile = temporaryProfiles.your[0] || {};
      const existingDemographics = temporaryDemographics.your || {};
      
      // Merge all existing data
      const mergedData = {
        ...existingProfile,
        ...existingDemographics
      };
      
      console.log('Loading existing personal profile data:', mergedData);
      setProfileData(mergedData);
      setIsReady(true);
    }
  }, [isLoaded, temporaryProfiles, temporaryDemographics]);

  // Save data function
  const saveData = (newData: any) => {
    if (!isLoaded) return;
    
    console.log('Saving personal profile data:', newData);
    
    // Update local state immediately
    setProfileData(prev => ({ ...prev, ...newData }));
    
    // Merge with existing data
    const currentProfile = temporaryProfiles.your[0] || {};
    const currentDemographics = temporaryDemographics.your || {};
    
    const updatedData = {
      ...currentProfile,
      ...currentDemographics,
      ...newData
    };
    
    // Update both profile and demographics
    const newProfiles = {
      ...temporaryProfiles,
      your: [updatedData]
    };
    
    const newDemographics = {
      ...temporaryDemographics,
      your: updatedData
    };
    
    updateTemporaryProfile(newProfiles, newDemographics);
  };

  // Update single field
  const updateField = (field: string, value: any) => {
    const updatedData = { [field]: value };
    saveData(updatedData);
  };

  // Handle multi-select fields
  const handleMultiSelect = (field: string, value: string) => {
    const current = profileData[field] || [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    updateField(field, updated);
  };

  return {
    profileData,
    isReady,
    saveData,
    updateField,
    handleMultiSelect
  };
};
