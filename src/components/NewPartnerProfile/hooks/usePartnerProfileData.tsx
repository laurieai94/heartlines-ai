import { useState, useEffect } from 'react';
import { PartnerProfileData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { calculatePartnerProgress } from '../utils/partnerValidation';
import { useAuth } from '@/contexts/AuthContext';

const defaultPartnerProfileData: PartnerProfileData = {
  // Section 1: The Basics
  partnerName: '',
  partnerPronouns: '',
  partnerAge: '',
  partnerOrientation: '',
  partnerGender: '',
  
  // Section 2: How They Operate
  partnerLoveLanguage: [],
  partnerConflictStyle: [],
  partnerCommunicationResponse: [],
  partnerSelfAwareness: '',
  
  // Section 3: Their Foundation
  partnerFamilyStructure: [],
  partnerAttachmentStyle: ''
};

export const usePartnerProfileData = (onAutoComplete?: () => void) => {
  const [profileData, setProfileData] = useState<PartnerProfileData>(defaultPartnerProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load profile data
  const loadProfile = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage for now
      const localData = localStorage.getItem('partner_profile_data');
      if (localData) {
        setProfileData(JSON.parse(localData));
      }
    } catch (error) {
      console.error('Error loading partner profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save to localStorage (immediate)
  const saveToLocalStorage = (data: PartnerProfileData) => {
    localStorage.setItem('partner_profile_data', JSON.stringify(data));
  };

  // Save profile (localStorage only for now)
  const saveProfile = async (dataToSave?: PartnerProfileData) => {
    const currentData = dataToSave || profileData;
    saveToLocalStorage(currentData);
  };

  // Initialize
  useEffect(() => {
    loadProfile();
  }, []);

  // Auto-save to localStorage and debounced save to Supabase
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage(profileData);
      
      const saveTimer = setTimeout(() => {
        saveProfile(profileData);
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [profileData, isLoading]);

  // Update field
  const updateField = (field: keyof PartnerProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle multi-select
  const handleMultiSelect = (field: keyof PartnerProfileData, value: string) => {
    setProfileData(prev => {
      const currentValues = prev[field] as string[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues
      };
    });
  };

  // Auto-completion logic
  useEffect(() => {
    if (profileData && calculatePartnerProgress(profileData) === 100 && onAutoComplete) {
      const timer = setTimeout(() => {
        onAutoComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [profileData, onAutoComplete]);

  return {
    profileData,
    isLoading,
    updateField,
    handleMultiSelect,
    saveProfile
  };
};