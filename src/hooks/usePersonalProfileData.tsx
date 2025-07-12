
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileStorage } from './useProfileStorage';
import { useProfileDatabase } from './useProfileDatabase';
import { useProfileFields } from './useProfileFields';

interface PersonalProfileData {
  // Section 1 - The Basics
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
  
  // Section 4 - Your Foundation (New Questions)
  familySituation?: string;
  familySituationOther?: string;
  familyEmotions?: string[];
  familyEmotionsOther?: string;
  familyConflict?: string[];
  familyConflictOther?: string;
  familyLove?: string[];
  familyLoveOther?: string;
  
  // Metadata
  completedAt?: string;
  profileSource?: string;
  [key: string]: any;
}

export const usePersonalProfileData = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  const { profileData, setProfileData, loadFromStorage, saveToStorage } = useProfileStorage();
  const { loadFromDatabase, saveToDatabase } = useProfileDatabase();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load from localStorage first
        const localData = loadFromStorage();
        if (Object.keys(localData).length > 0) {
          setProfileData(localData);
        }

        // Load from database if user is authenticated
        const dbData = await loadFromDatabase();
        if (Object.keys(dbData).length > 0) {
          setProfileData(prev => {
            const prevData = prev || {};
            return { ...prevData, ...dbData };
          });
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
  const saveData = async (newData: Partial<PersonalProfileData>) => {
    if (!newData || Object.keys(newData).length === 0) {
      return;
    }

    console.log('Saving personal profile data:', newData);
    
    const currentData = profileData || {};
    const newDataSafe = newData || {};
    const updatedData = { ...currentData, ...newDataSafe };
    
    setProfileData(updatedData);
    saveToStorage(updatedData);
    await saveToDatabase(updatedData);
  };

  const { updateField, handleMultiSelect } = useProfileFields(profileData, saveData);

  return {
    profileData,
    isLoading,
    isReady,
    saveData,
    updateField,
    handleMultiSelect
  };
};
