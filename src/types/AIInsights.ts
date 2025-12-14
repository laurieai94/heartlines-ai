
export interface ProfileData {
  your: any[];
  partner: any[];
}

export interface DemographicsData {
  your: any;
  partner: any;
}

export interface AIInsightsProps {
  profiles?: ProfileData;
  demographicsData?: DemographicsData;
}

export interface FamilyBackground {
  situation?: string[];
  emotions?: string[];
  conflict?: string[];
  love?: string[];
  dynamics?: string[];
}

export interface PersonContext {
  relationship: {
    length?: string;
    livingTogether?: boolean;
    stage?: string;
    emotionalConnection?: string;
    livingArrangement?: string;
    relationshipType?: string;
  };
  yourTraits: {
    name?: string;
    age?: string;
    pronouns?: string;
    loveLanguages?: string[];
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string[];
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
    familyDynamics?: string[];
    familyBackground?: FamilyBackground;
    whyRealTalk?: string[];
    mentalHealthContext?: string;
    education?: string;
    workSituation?: string;
    sexualOrientation?: string[];
    genderIdentity?: string[];
    parentConflictStyle?: string[];
    loveMessages?: string[];
    loveInfluences?: string[];
    relationshipLength?: string;
    feelsDifficult?: string[];
    hopingFor?: string[];
    readiness?: string[];
    healthyRelationship?: string[];
    additionalInfo?: string;
    profileComplete?: boolean;
    completedAt?: string;
    // New dating-specific fields
    datingChallenges?: string[];
    datingGoals?: string[];
    datingContext?: string;
    // New relationship-specific fields
    talkingDuration?: string;
    talkingDescription?: string[];
    talkingChallenges?: string[];
    relationshipChallenges?: string[];
    relationshipWorking?: string[];
    // Status-specific fields
    separationSituation?: string[];
    datingReadiness?: string[];
    timeSinceLoss?: string;
    grievingProcess?: string[];
    // Foundation fields
    heartbreakBetrayal?: string[];
    familyStructure?: string[];
  };
  partnerTraits: {
    name?: string;
    age?: string;
    pronouns?: string;
    loveLanguages?: string[];
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string[];
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
    familyDynamics?: string[];
    familyBackground?: FamilyBackground;
    whyRealTalk?: string[];
    mentalHealthContext?: string;
    education?: string;
    workSituation?: string;
    sexualOrientation?: string[];
    genderIdentity?: string[];
    // New partner fields
    communicationResponse?: string[];
    selfAwareness?: string;
    heartbreakBetrayal?: string[];
    familyStructure?: string[];
  };
  dynamics: {
    loveLanguageMatch?: boolean;
    loveLanguageGap?: boolean;
    communicationMatch?: boolean;
    conflictDynamic?: string;
  };
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  isError?: boolean;
  originalUserMessage?: string; // For retry functionality
}
