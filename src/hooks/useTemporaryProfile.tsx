
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { batchedStorage } from '@/utils/batchedStorage';

interface TemporaryProfileData {
  your: any[];
  partner: any[];
}

interface TemporaryDemographicsData {
  your: any;
  partner: any;
}

export const useTemporaryProfile = () => {
  const { user } = useAuth();
  const [temporaryProfiles, setTemporaryProfiles] = useState<TemporaryProfileData>({
    your: [],
    partner: []
  });
  const [temporaryDemographics, setTemporaryDemographics] = useState<TemporaryDemographicsData>({
    your: null,
    partner: null
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load temporary data from localStorage on mount
  useEffect(() => {
    const loadTemporaryData = () => {
      try {
        // Load old format data
        const savedProfiles = batchedStorage.getItem('realtalk_temp_profiles');
        const savedDemographics = batchedStorage.getItem('realtalk_temp_demographics');
        
        // Load new questionnaire format data
        const personalQuestionnaire = batchedStorage.getItem('personal_profile_questionnaire');
        const partnerQuestionnaire = batchedStorage.getItem('partner_profile_questionnaire');
        
        // Initialize with default structure
        let profiles = { your: [], partner: [] };
        let demographics = { your: null, partner: null };
        
        // Parse old format data first
        if (savedProfiles) {
          const parsed = JSON.parse(savedProfiles);
          profiles = { ...profiles, ...parsed };
        }
        
        if (savedDemographics) {
          const parsed = JSON.parse(savedDemographics);
          demographics = { ...demographics, ...parsed };
        }
        
        // Parse and merge new questionnaire data (prioritize over old data)
        if (personalQuestionnaire) {
          const personalData = JSON.parse(personalQuestionnaire);
          
          // Convert new format to temporary format - preserve ALL data
          if (personalData && Object.keys(personalData).length > 0) {
            profiles.your = [personalData];
            // Keep ALL questionnaire data, not just basic demographics
            demographics.your = personalData;
          }
        }
        
        if (partnerQuestionnaire) {
          const partnerData = JSON.parse(partnerQuestionnaire);
          
          // Convert new format to temporary format - preserve ALL data
          if (partnerData && Object.keys(partnerData).length > 0) {
            profiles.partner = [partnerData];
            // Keep ALL questionnaire data, not just basic demographics
            demographics.partner = partnerData;
          }
        }
        
        setTemporaryProfiles(profiles);
        setTemporaryDemographics(demographics);
        setIsLoaded(true);
      } catch (error) {
        setIsLoaded(true);
      }
    };

    loadTemporaryData();
  }, []);

  // Save to localStorage whenever data changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        batchedStorage.setItem('realtalk_temp_profiles', JSON.stringify(temporaryProfiles));
      } catch (error) {
        // Silent fail
      }
    }
  }, [temporaryProfiles, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        batchedStorage.setItem('realtalk_temp_demographics', JSON.stringify(temporaryDemographics));
      } catch (error) {
        // Silent fail
      }
    }
  }, [temporaryDemographics, isLoaded]);

  const updateTemporaryProfile = (newProfiles: TemporaryProfileData, newDemographics: TemporaryDemographicsData) => {
    // Immediately save to localStorage as well as state
    try {
      batchedStorage.setItem('realtalk_temp_profiles', JSON.stringify(newProfiles));
      batchedStorage.setItem('realtalk_temp_demographics', JSON.stringify(newDemographics));
    } catch (error) {
      // Silent fail
    }
    
    setTemporaryProfiles(newProfiles);
    setTemporaryDemographics(newDemographics);
  };

  const transferToUserAccount = async () => {
    if (!user) return;

    try {
      // Save your profile
      if (temporaryProfiles.your.length > 0 || temporaryDemographics.your) {
        await supabase.from('user_profiles').upsert({
          user_id: user.id,
          profile_type: 'your',
          profile_data: temporaryProfiles.your[0] || {},
          demographics_data: temporaryDemographics.your || {}
        });
      }

      // Save partner profile
      if (temporaryProfiles.partner.length > 0 || temporaryDemographics.partner) {
        await supabase.from('user_profiles').upsert({
          user_id: user.id,
          profile_type: 'partner',
          profile_data: temporaryProfiles.partner[0] || {},
          demographics_data: temporaryDemographics.partner || {}
        });
      }

      // Clear temporary data
      batchedStorage.removeItem('realtalk_temp_profiles');
      batchedStorage.removeItem('realtalk_temp_demographics');
      
      setTemporaryProfiles({ your: [], partner: [] });
      setTemporaryDemographics({ your: null, partner: null });
      
    } catch (error) {
      console.error('Error transferring profile data:', error);
    }
  };

  return {
    temporaryProfiles,
    temporaryDemographics,
    updateTemporaryProfile,
    transferToUserAccount,
    isLoaded
  };
};
