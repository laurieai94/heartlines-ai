import { ProfileData } from '../types';
import { areRequiredFieldsComplete, getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from './requirements';
import { profileCompletionCache, validationCache } from '@/utils/calculationCache';

// Get fields relevant to a specific section to minimize cache key size
const getSectionFields = (section: number): string[] => {
  const sectionFields: Record<number, string[]> = {
    1: ['name', 'pronouns', 'age', 'orientation', 'gender'],
    2: ['relationshipStatus', 'datingChallenges', 'talkingDescription', 'talkingChallenges', 'relationshipLength', 'relationshipChallenges', 'relationshipWorking', 'separationSituation', 'datingReadiness', 'timeSinceLoss', 'grievingProcess'],
    3: ['loveLanguage', 'conflictStyle'],
    4: ['attachmentStyle', 'heartbreakBetrayal', 'familyStructure']
  };
  return sectionFields[section] || [];
};

// Optimized validation with caching
export const validateSectionOptimized = (section: number, profileData: ProfileData): boolean => {
  return validationCache.get(`validateSection-${section}`, profileData, () => {
    // Use new requirements-based validation for sections 1, 3, and 4
    if (section === 1 || section === 3 || section === 4) {
      return areRequiredFieldsComplete(section, profileData);
    }
    
    // Section 2 special logic - only relationshipStatus is required
    if (section === 2) {
      return !!profileData.relationshipStatus && profileData.relationshipStatus.trim() !== '';
    }
    
    return true;
  });
};

// Optimized progress calculation with global caching
export const calculateProgressOptimized = (profileData: ProfileData, skipCache = false): number => {
  // Force fresh calculation when skipCache is true
  if (skipCache) {
    try {
      const totalApplicable = getTotalRequiredFieldsCount();
      const totalCompleted = getCompletedRequiredFieldsCount(profileData);
      const progress = totalApplicable > 0 ? Math.round((totalCompleted / totalApplicable) * 100) : 0;
      return progress;
    } catch (error) {
      console.error('Progress calculation error:', error);
      return 0;
    }
  }
  
  return profileCompletionCache.get('personal-progress', profileData, () => {
    try {
      // Get total applicable fields count based on relationship status
      const totalApplicable = getTotalRequiredFieldsCount();
      const totalCompleted = getCompletedRequiredFieldsCount(profileData);
      
      const progress = totalApplicable > 0 ? Math.round((totalCompleted / totalApplicable) * 100) : 0;
      return progress;
    } catch (error) {
      console.error('Progress calculation error:', error);
      return 0;
    }
  });
};

// Simplified field completion check with early returns
const isFieldCompleteOptimized = (value: any): boolean => {
  // Early returns for common cases
  if (!value) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Export the optimized functions for use in components
export {
  isFieldCompleteOptimized as isFieldComplete
};