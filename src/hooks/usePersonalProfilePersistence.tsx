
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePersonalProfilePersistence = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First try to load from localStorage
        const localData = localStorage.getItem('personal_profile_data');
        if (localData) {
          const parsed = JSON.parse(localData);
          console.log('Loaded personal profile from localStorage:', parsed);
          setProfileData(parsed || {});
        }

        // If user is authenticated, also try to load from database
        if (user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('demographics_data')
            .eq('user_id', user.id)
            .eq('profile_type', 'your')
            .single();

          if (data && !error && data.demographics_data) {
            console.log('Loaded personal profile from database:', data.demographics_data);
            setProfileData(prev => {
              const prevData = prev || {};
              const dbData = data.demographics_data || {};
              return { ...prevData, ...dbData };
            });
          }
        }
      } catch (error) {
        console.error('Error loading personal profile data:', error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadData();
  }, [user]);

  // Save data function
  const saveData = async (newData: Record<string, any>) => {
    console.log('Saving personal profile data:', newData);
    
    const currentData = profileData || {};
    const newDataSafe = newData || {};
    const updatedData = { ...currentData, ...newDataSafe };
    
    setProfileData(updatedData);

    // Save to localStorage immediately
    try {
      localStorage.setItem('personal_profile_data', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Save to database if user is authenticated
    if (user) {
      try {
        await supabase.from('user_profiles').upsert({
          user_id: user.id,
          profile_type: 'your',
          demographics_data: updatedData,
          profile_data: {}
        });
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    }
  };

  // Update single field
  const updateField = (field: string, value: any) => {
    const updatedData = { [field]: value };
    saveData(updatedData);
  };

  // Handle multi-select fields
  const handleMultiSelect = (field: string, value: string) => {
    const currentData = profileData || {};
    const current = currentData[field] || [];
    const updated = current.includes(value) 
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    updateField(field, updated);
  };

  return {
    profileData,
    isLoading,
    isReady,
    saveData,
    updateField,
    handleMultiSelect
  };
};
