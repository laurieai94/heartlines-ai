
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

export interface PersonContext {
  relationship: {
    length?: string;
    livingTogether?: boolean;
    stage?: string;
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
    whyRealTalk?: string[];
    mentalHealthContext?: string;
    education?: string;
    workSituation?: string;
    sexualOrientation?: string[];
    genderIdentity?: string[];
  };
  partnerTraits: {
    name?: string;
    loveLanguages?: string[];
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string[];
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
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
}
