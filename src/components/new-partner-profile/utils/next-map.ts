import { PartnerProfileData } from '../types';

// Deterministic partner question flow
export const getNextPartnerQuestion = (currentQuestionId: string, profileData: PartnerProfileData): string | 'COMPLETE' => {
  
  // Section 1: Partner Basics
  if (currentQuestionId === 'partner-name-pronouns-question') {
    return 'partner-age-question';
  }
  
  if (currentQuestionId === 'partner-age-question') {
    return 'partner-gender-question';
  }
  
  if (currentQuestionId === 'partner-gender-question') {
    return 'partner-orientation-question';
  }
  
  if (currentQuestionId === 'partner-orientation-question') {
    return 'partner-attachment-question';
  }

  // Section 2: Partner Foundation 
  if (currentQuestionId === 'partner-attachment-question') {
    return 'partner-family-dynamic-question';
  }
  
  if (currentQuestionId === 'partner-family-dynamic-question') {
    return 'partner-heartbreak-betrayal-question';
  }
  
  if (currentQuestionId === 'partner-heartbreak-betrayal-question') {
    return 'partner-self-awareness-question';
  }

  // Section 3: Partner Operations
  if (currentQuestionId === 'partner-self-awareness-question') {
    return 'partner-love-language-question';
  }
  
  if (currentQuestionId === 'partner-love-language-question') {
    return 'partner-conflict-question';
  }
  
  if (currentQuestionId === 'partner-conflict-question') {
    return 'partner-communication-response-question';
  }
  
  if (currentQuestionId === 'partner-communication-response-question') {
    return 'COMPLETE';
  }

  // If we don't recognize the question, try to complete
  // No-op in production
  return 'COMPLETE';
};