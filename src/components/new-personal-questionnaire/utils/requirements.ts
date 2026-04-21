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
    const trimmed = value.trim();
    return trimmed !== '' && trimmed.length > 0;
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
  const section1Fields = SECTION_REQUIREMENTS[1].required.filter(field => {
    const isComplete = isFieldComplete(profileData[field]);
    console.log(`[Requirements] Section 1 - ${field}:`, profileData[field], 'Complete:', isComplete);
    return isComplete;
  });
  completed += section1Fields.length;
  
  // Section 2 required field (relationshipStatus)
  const relationshipStatusComplete = isFieldComplete(profileData.relationshipStatus);
  console.log('[Requirements] Section 2 - relationshipStatus:', profileData.relationshipStatus, 'Complete:', relationshipStatusComplete);
  if (relationshipStatusComplete) {
    completed += 1;
  }
  
  // Section 3 required fields  
  const section3Fields = SECTION_REQUIREMENTS[3].required.filter(field => {
    const isComplete = isFieldComplete(profileData[field]);
    console.log(`[Requirements] Section 3 - ${field}:`, profileData[field], 'Complete:', isComplete);
    return isComplete;
  });
  completed += section3Fields.length;
  
  // Section 4 required fields
  const section4Fields = SECTION_REQUIREMENTS[4].required.filter(field => {
    const isComplete = isFieldComplete(profileData[field]);
    console.log(`[Requirements] Section 4 - ${field}:`, profileData[field], 'Complete:', isComplete);
    return isComplete;
  });
  completed += section4Fields.length;
  
  console.log('[Requirements] Total completed:', completed, 'of', getTotalRequiredFieldsCount());
  return completed;
};