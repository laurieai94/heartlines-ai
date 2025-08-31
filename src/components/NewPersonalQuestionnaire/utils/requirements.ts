import { ProfileData } from '../types';

export interface SectionRequirements {
  required: (keyof ProfileData)[];
  optional: (keyof ProfileData)[];
}

export const SECTION_REQUIREMENTS: Record<number, SectionRequirements> = {
  1: {
    required: ['name', 'pronouns'],
    optional: ['age', 'orientation', 'gender']
  },
  2: {
    required: ['relationshipStatus'],
    optional: [
      // Single options
      'datingChallenges',
      // Talking stage options  
      'talkingDescription',
      'talkingChallenges',
      // Relationship options
      'relationshipLength',
      'relationshipChallenges', 
      'relationshipWorking',
      // Separated/Divorced options
      'separationSituation',
      'datingReadiness',
      // Widowed options
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
export const isFieldComplete = (value: any): boolean => {
  if (typeof value === 'string') {
    return value && value.trim() !== '';
  } else if (Array.isArray(value)) {
    return value && value.length > 0;
  }
  return !!value;
};

// Check if required fields for a section are complete
export const areRequiredFieldsComplete = (section: number, profileData: ProfileData): boolean => {
  const requirements = SECTION_REQUIREMENTS[section];
  if (!requirements) return true;
  
  return requirements.required.every(field => isFieldComplete(profileData[field]));
};

// Get total required fields count across all sections (excluding conditional section 2 fields)
export const getTotalRequiredFieldsCount = (): number => {
  return SECTION_REQUIREMENTS[1].required.length + 
         1 + // relationshipStatus from section 2
         SECTION_REQUIREMENTS[3].required.length + 
         SECTION_REQUIREMENTS[4].required.length;
};

// Get completed required fields count across all sections
export const getCompletedRequiredFieldsCount = (profileData: ProfileData): number => {
  let completed = 0;
  
  // Section 1 required fields
  completed += SECTION_REQUIREMENTS[1].required.filter(field => 
    isFieldComplete(profileData[field])
  ).length;
  
  // Section 2 required field (relationshipStatus)
  if (isFieldComplete(profileData.relationshipStatus)) {
    completed += 1;
  }
  
  // Section 3 required fields  
  completed += SECTION_REQUIREMENTS[3].required.filter(field => 
    isFieldComplete(profileData[field])
  ).length;
  
  // Section 4 required fields
  completed += SECTION_REQUIREMENTS[4].required.filter(field => 
    isFieldComplete(profileData[field])
  ).length;
  
  return completed;
};