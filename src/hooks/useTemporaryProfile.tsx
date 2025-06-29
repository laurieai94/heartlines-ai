
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
        const savedProfiles = localStorage.getItem('realtalk_temp_profiles');
        const savedDemographics = localStorage.getItem('realtalk_temp_demographics');
        
        console.log('Loading temporary data from localStorage:', { savedProfiles, savedDemographics });
        
        if (savedProfiles) {
          const parsed = JSON.parse(savedProfiles);
          console.log('Parsed profiles:', parsed);
          setTemporaryProfiles(parsed);
        }
        
        if (savedDemographics) {
          const parsed = JSON.parse(savedDemographics);
          console.log('Parsed demographics:', parsed);
          setTemporaryDemographics(parsed);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading temporary data:', error);
        setIsLoaded(true);
      }
    };

    loadTemporaryData();
  }, []);

  // Save to localStorage whenever data changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving profiles to localStorage:', temporaryProfiles);
      try {
        localStorage.setItem('realtalk_temp_profiles', JSON.stringify(temporaryProfiles));
      } catch (error) {
        console.error('Error saving profiles to localStorage:', error);
      }
    }
  }, [temporaryProfiles, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      console.log('Saving demographics to localStorage:', temporaryDemographics);
      try {
        localStorage.setItem('realtalk_temp_demographics', JSON.stringify(temporaryDemographics));
      } catch (error) {
        console.error('Error saving demographics to localStorage:', error);
      }
    }
  }, [temporaryDemographics, isLoaded]);

  const updateTemporaryProfile = (newProfiles: TemporaryProfileData, newDemographics: TemporaryDemographicsData) => {
    console.log('Updating temporary profile data:', { newProfiles, newDemographics });
    
    // Immediately save to localStorage as well as state
    try {
      localStorage.setItem('realtalk_temp_profiles', JSON.stringify(newProfiles));
      localStorage.setItem('realtalk_temp_demographics', JSON.stringify(newDemographics));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
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
      localStorage.removeItem('realtalk_temp_profiles');
      localStorage.removeItem('realtalk_temp_demographics');
      
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
