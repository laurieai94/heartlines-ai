
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PersonalProfileData {
  // Section 1 - Who You Are
  name?: string;
  age?: string;
  gender?: string[];
  orientation?: string[];
  profilePhoto?: string;
  
  // Section 2 - Your Relationship World
  relationshipStatus?: string;
  relationshipLength?: string;
  whyRealTalk?: string[];
  biggestChallenge?: string[];
  workingWell?: string[];
  feelsDifficult?: string[];
  
  // Section 3 - How You Operate
  stressResponse?: string[];
  conflictNeeds?: string[];
  feelLovedWhen?: string[];
  attachmentStyle?: string;
  
  // Section 4 - Your Foundation
  familyDynamics?: string[];
  parentConflictStyle?: string[];
  loveMessages?: string[];
  loveInfluences?: string[];
  mentalHealthContext?: string;
  growthAreas?: string[];
  
  // Metadata
  completedAt?: string;
  profileSource?: string;
  [key: string]: any;
}

export const usePersonalProfileData = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<PersonalProfileData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // First try to load from localStorage
        const localData = localStorage.getItem('personal_profile_questionnaire');
        if (localData) {
          const parsed = JSON.parse(localData);
          console.log('Loaded personal profile from localStorage:', parsed);
          setProfileData(parsed || {});
        }

        // If user is authenticated, also try to load from database
        if (user) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('profile_data, demographics_data')
            .eq('user_id', user.id)
            .eq('profile_type', 'your')
            .single();

          if (data && !error) {
            // Merge profile_data and demographics_data
            const dbData = {
              ...(typeof data.profile_data === 'object' && data.profile_data !== null ? data.profile_data : {}),
              ...(typeof data.demographics_data === 'object' && data.demographics_data !== null ? data.demographics_data : {})
            };
            
            console.log('Loaded personal profile from database:', dbData);
            setProfileData(prev => {
              const prevData = prev || {};
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

  // Save data function - only saves when there's actual data
  const saveData = async (newData: Partial<PersonalProfileData>) => {
    // Don't save if newData is empty or has no meaningful content
    if (!newData || Object.keys(newData).length === 0) {
      return;
    }

    console.log('Saving personal profile data:', newData);
    
    const currentData = profileData || {};
    const newDataSafe = newData || {};
    const updatedData = { ...currentData, ...newDataSafe };
    
    setProfileData(updatedData);

    // Save to localStorage immediately
    try {
      localStorage.setItem('personal_profile_questionnaire', JSON.stringify(updatedData));
      console.log('Saved to localStorage successfully');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    // Save to database if user is authenticated
    if (user) {
      try {
        const { error } = await supabase.from('user_profiles').upsert({
          user_id: user.id,
          profile_type: 'your',
          profile_data: updatedData,
          demographics_data: updatedData,
          updated_at: new Date().toISOString()
        });
        
        if (error) {
          console.error('Database save error:', error);
        } else {
          console.log('Saved to database successfully');
        }
      } catch (error) {
        console.error('Error saving to database:', error);
      }
    }
  };

  // Update single field
  const updateField = (field: string, value: any) => {
    console.log(`Updating field: ${field} with value:`, value);
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
    
    console.log(`Multi-select update for ${field}:`, updated);
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
