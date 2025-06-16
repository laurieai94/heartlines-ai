
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
    loveLanguage?: string;
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string;
    attachmentStyle?: string;
    triggers?: string[];
    strengths?: string[];
    growthAreas?: string[];
  };
  partnerTraits: {
    name?: string;
    loveLanguage?: string;
    communicationStyle?: string;
    conflictStyle?: string;
    stressResponse?: string;
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
