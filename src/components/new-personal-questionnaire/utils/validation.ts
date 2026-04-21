import { ProfileData } from '../types';
import { areRequiredFieldsComplete, getTotalRequiredFieldsCount, getCompletedRequiredFieldsCount } from './requirements';

// Local constants to avoid import issues
const SECTION_REQUIREMENTS = {
  1: {
    required: ['name', 'pronouns'],
    optional: ['age', 'orientation', 'gender']
  },
  2: {
    required: ['relationshipStatus'],
    optional: [
      'datingChallenges',
      'talkingDescription',
      'talkingChallenges',
      'relationshipLength',
      'relationshipChallenges', 
      'relationshipWorking',
      'separationSituation',
      'datingReadiness',
      'timeSinceLoss',
      'grievingProcess'
    ]
  },
  3: {
    required: ['loveLanguage'],
    optional: ['conflictStyle']
  },
  4: {
    required: ['attachmentStyle'],
    optional: ['heartbreakBetrayal', 'familyStructure']
  }
};

// Helper function to check if a field value is complete
const isFieldComplete = (value: any): boolean => {
  if (typeof value === 'string') {
    return value && value.trim() !== '';
  } else if (Array.isArray(value)) {
    return value && value.length > 0;
  }
  return !!value;
};

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

// Get total applicable fields count based on relationship status
export const getTotalApplicableFieldsCount = (profileData: ProfileData): number => {
  let total = 0;
  
  // Section 1: Always count all fields
  total += SECTION_REQUIREMENTS[1].required.length + SECTION_REQUIREMENTS[1].optional.length;
  
  // Section 2: Count relationshipStatus + applicable conditional fields
  total += 1; // relationshipStatus
  
  const relationshipStatus = profileData.relationshipStatus;
  if (relationshipStatus === 'single') {
    total += 1; // datingChallenges
  } else if (relationshipStatus === 'talking_stage') {
    total += 2; // talkingDescription, talkingChallenges
  } else if (['in_relationship', 'married', 'engaged'].includes(relationshipStatus)) {
    total += 3; // relationshipLength, relationshipChallenges, relationshipWorking
  } else if (['separated', 'divorced'].includes(relationshipStatus)) {
    total += 2; // separationSituation, datingReadiness
  } else if (relationshipStatus === 'widowed') {
    total += 2; // timeSinceLoss, grievingProcess
  }
  
  // Section 3: Always count all fields
  total += SECTION_REQUIREMENTS[3].required.length + SECTION_REQUIREMENTS[3].optional.length;
  
  // Section 4: Always count all fields
  total += SECTION_REQUIREMENTS[4].required.length + SECTION_REQUIREMENTS[4].optional.length;
  
  return total;
};

// Get completed applicable fields count based on relationship status
export const getCompletedApplicableFieldsCount = (profileData: ProfileData): number => {
  let completed = 0;
  
  // Section 1: Count all completed fields
  [...SECTION_REQUIREMENTS[1].required, ...SECTION_REQUIREMENTS[1].optional].forEach(field => {
    if (isFieldComplete(profileData[field])) completed++;
  });
  
  // Section 2: Count relationshipStatus + applicable conditional fields
  if (isFieldComplete(profileData.relationshipStatus)) completed++;
  
  const relationshipStatus = profileData.relationshipStatus;
  if (relationshipStatus === 'single') {
    if (isFieldComplete(profileData.datingChallenges)) completed++;
  } else if (relationshipStatus === 'talking_stage') {
    if (isFieldComplete(profileData.talkingDescription)) completed++;
    if (isFieldComplete(profileData.talkingChallenges)) completed++;
  } else if (['in_relationship', 'married', 'engaged'].includes(relationshipStatus)) {
    if (isFieldComplete(profileData.relationshipLength)) completed++;
    if (isFieldComplete(profileData.relationshipChallenges)) completed++;
    if (isFieldComplete(profileData.relationshipWorking)) completed++;
  } else if (['separated', 'divorced'].includes(relationshipStatus)) {
    if (isFieldComplete(profileData.separationSituation)) completed++;
    if (isFieldComplete(profileData.datingReadiness)) completed++;
  } else if (relationshipStatus === 'widowed') {
    if (isFieldComplete(profileData.timeSinceLoss)) completed++;
    if (isFieldComplete(profileData.grievingProcess)) completed++;
  }
  
  // Section 3: Count all completed fields
  [...SECTION_REQUIREMENTS[3].required, ...SECTION_REQUIREMENTS[3].optional].forEach(field => {
    if (isFieldComplete(profileData[field])) completed++;
  });
  
  // Section 4: Count all completed fields
  [...SECTION_REQUIREMENTS[4].required, ...SECTION_REQUIREMENTS[4].optional].forEach(field => {
    if (isFieldComplete(profileData[field])) completed++;
  });
  
  return completed;
};

export const calculateProgress = (profileData: ProfileData): number => {
  const totalApplicable = getTotalApplicableFieldsCount(profileData);
  const totalCompleted = getCompletedApplicableFieldsCount(profileData);
  
  return totalApplicable > 0 ? Math.round((totalCompleted / totalApplicable) * 100) : 0;
};