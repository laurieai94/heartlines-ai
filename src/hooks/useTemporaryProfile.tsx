
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

  // Load temporary data from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('realtalk_temp_profiles');
    const savedDemographics = localStorage.getItem('realtalk_temp_demographics');
    
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        setTemporaryProfiles(parsed);
      } catch (error) {
        console.error('Error parsing saved profiles:', error);
      }
    }
    
    if (savedDemographics) {
      try {
        const parsed = JSON.parse(savedDemographics);
        setTemporaryDemographics(parsed);
      } catch (error) {
        console.error('Error parsing saved demographics:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('realtalk_temp_profiles', JSON.stringify(temporaryProfiles));
  }, [temporaryProfiles]);

  useEffect(() => {
    localStorage.setItem('realtalk_temp_demographics', JSON.stringify(temporaryDemographics));
  }, [temporaryDemographics]);

  const updateTemporaryProfile = (newProfiles: TemporaryProfileData, newDemographics: TemporaryDemographicsData) => {
    console.log('Updating temporary profile data:', { newProfiles, newDemographics });
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
    transferToUserAccount
  };
};
