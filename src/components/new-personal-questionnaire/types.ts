
export interface ProfileData {
  // Section 1: The Basics
  name: string;
  age: string;
  gender: string[];
  orientation: string[];
  pronouns: string;
  
  // Section 2: Your Relationship
  relationshipStatus: string;
  relationshipLength: string;
  talkingDuration: string;
  talkingDescription: string[];
  talkingChallenges: string[];
  relationshipChallenges: string[];
  relationshipWorking: string[];
  datingChallenges: string[];
  
  // Separated/Divorced specific fields
  separationSituation: string[];
  datingReadiness: string[];
  
  // Widowed specific fields
  timeSinceLoss: string;
  grievingProcess: string[];
  
  // Section 3: How You Operate
  stressResponse: string[];
  conflictStyle: string[];
  loveLanguage: string[];
  
  // Section 4: Your Foundation
  heartbreakBetrayal: string[];
  familyStructure: string[];
  attachmentStyle: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}
