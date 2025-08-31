import { ProfileData } from '../types';
import { areRequiredFieldsComplete, getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from './requirements';

export const validateSection = (section: number, profileData: ProfileData): boolean => {
  // Use new requirements-based validation for sections 1, 3, and 4
  if (section === 1 || section === 3 || section === 4) {
    return areRequiredFieldsComplete(section, profileData);
  }
  
  // Section 2 special logic - only relationshipStatus is required, follow-ups are optional
  if (section === 2) {
    return !!profileData.relationshipStatus && profileData.relationshipStatus.trim() !== '';
  }
  
  return true;
};

export const calculateProgress = (profileData: ProfileData): number => {
  const totalRequired = getTotalRequiredFieldsCount();
  const totalCompleted = getCompletedRequiredFieldsCount(profileData);
  
  return totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;
};