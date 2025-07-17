
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProfileData } from '../types';

const defaultProfileData: ProfileData = {
  // Section 1: The Basics
  name: '',
  age: '',
  gender: '',
  orientation: '',
  pronouns: '',
  
  // Section 2: Your Relationship
  relationshipStatus: '',
  relationshipLength: '',
  talkingDuration: '',
  talkingDescription: [],
  talkingChallenges: [],
  relationshipChallenges: [],
  relationshipWorking: [],
  datingChallenges: [],
  
    // Separated/Divorced specific fields
    separationSituation: [],
    datingReadiness: [],
    
    // Widowed specific fields
    timeSinceLoss: '',
    grievingProcess: [],
  
  // Section 3: How You Operate
  stressResponse: [],
  conflictStyle: [],
  loveLanguage: [],
  
  // Section 4: Your Foundation
  familyStructure: [],
  familyDynamics: [],
  attachmentStyle: ''
};

export const useProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing profile data
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    
    // If no user, just set loading to false and return
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('profile_data')
        .eq('user_id', user.id)
        .eq('profile_type', 'personal')
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (data?.profile_data) {
        setProfileData({ ...defaultProfileData, ...(data.profile_data as unknown as ProfileData) });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Auto-save profile data with debouncing
  const saveProfile = useCallback(async (dataToSave?: ProfileData) => {
    if (!user?.id) return;

    const data = dataToSave || profileData;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          profile_type: 'personal',
          profile_data: data as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  }, [user?.id, profileData]);

  // Debounced auto-save
  useEffect(() => {
    if (!isLoading && user?.id) {
      const timeoutId = setTimeout(() => {
        saveProfile();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [profileData, isLoading, user?.id, saveProfile]);

  // Load profile on mount or when user changes
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateField = useCallback((field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleMultiSelect = useCallback((field: keyof ProfileData, value: string) => {
    setProfileData(prev => {
      const currentValues = (prev[field] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  }, []);

  return {
    profileData,
    updateField,
    handleMultiSelect,
    isLoading,
    saveProfile
  };
};
