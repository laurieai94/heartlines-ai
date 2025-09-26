import { ProfileData } from '../types';
import { areRequiredFieldsComplete, getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from './requirements';

// Memoization cache for validation results
const validationCache = new Map<string, { result: any; timestamp: number }>();
const CACHE_TTL = 1000; // 1 second cache

// Create cache key from profile data
const createCacheKey = (operation: string, profileData: ProfileData, section?: number): string => {
  const relevantFields = section ? getSectionFields(section) : Object.keys(profileData);
  const fieldValues = relevantFields.map(field => `${field}:${JSON.stringify(profileData[field])}`).join('|');
  return `${operation}:${section || 'all'}:${fieldValues}`;
};

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

// Cached validation function
const getCachedResult = <T>(cacheKey: string, computation: () => T): T => {
  const cached = validationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  
  const result = computation();
  validationCache.set(cacheKey, { result, timestamp: Date.now() });
  
  // Cleanup old cache entries periodically
  if (validationCache.size > 50) {
    const now = Date.now();
    for (const [key, value] of validationCache.entries()) {
      if (now - value.timestamp > CACHE_TTL * 2) {
        validationCache.delete(key);
      }
    }
  }
  
  return result;
};

// Optimized validation with caching
export const validateSectionOptimized = (section: number, profileData: ProfileData): boolean => {
  const cacheKey = createCacheKey('validateSection', profileData, section);
  
  return getCachedResult(cacheKey, () => {
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

// Optimized progress calculation with caching and throttling
let progressCalculationTimer: NodeJS.Timeout | null = null;
let lastProgressResult = 0;

export const calculateProgressOptimized = (profileData: ProfileData): number => {
  const cacheKey = createCacheKey('calculateProgress', profileData);
  
  return getCachedResult(cacheKey, () => {
    try {
      // Get total applicable fields count based on relationship status
      const totalApplicable = getTotalRequiredFieldsCount();
      const totalCompleted = getCompletedRequiredFieldsCount(profileData);
      
      const progress = totalApplicable > 0 ? Math.round((totalCompleted / totalApplicable) * 100) : 0;
      lastProgressResult = progress;
      return progress;
    } catch (error) {
      console.error('Progress calculation error:', error);
      return lastProgressResult; // Return last known good result
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
  isFieldCompleteOptimized as isFieldComplete,
  getCachedResult,
  validationCache
};