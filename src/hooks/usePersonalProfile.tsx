
import { useState, useEffect } from 'react';
import { useTemporaryProfile } from './useTemporaryProfile';

export const usePersonalProfile = () => {
  const { temporaryProfiles, temporaryDemographics, updateTemporaryProfile, isLoaded } = useTemporaryProfile();
  
  // Get current personal profile data
  const getPersonalData = () => {
    if (!isLoaded) return {};
    
    const profileData = temporaryProfiles.your[0] || {};
    const demographicsData = temporaryDemographics.your || {};
    
    // Merge both data sources
    return {
      ...profileData,
      ...demographicsData
    };
  };

  // Save personal profile data
  const savePersonalData = (newData: any) => {
    if (!isLoaded) return;
    
    const currentData = getPersonalData();
    const updatedData = { ...currentData, ...newData };
    
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

  return {
    personalData: getPersonalData(),
    savePersonalData,
    isLoaded
  };
};
