
export interface ProfileData {
  // Section 1: Who You Are
  name: string;
  age: string;
  gender: string;
  orientation: string;
  pronouns: string;
  
  // Section 2: Your Relationship
  relationshipStatus: string;
  relationshipLength: string;
  relationshipChallenges: string[];
  relationshipWorking: string[];
  datingChallenges: string[];
  
  // Section 3: How You Operate
  stressResponse: string[];
  conflictStyle: string[];
  loveLanguage: string[];
  
  // Section 4: Your Foundation
  familyDynamics: string[];
  attachmentStyle: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}
