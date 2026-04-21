import { ProfileData } from '../types';

// Deterministic question flow - no intersection observers, no complex logic
export const getNextQuestion = (currentQuestionId: string, profileData: ProfileData): string | 'COMPLETE' => {
  
  // Section 1: Who You Are
  if (currentQuestionId === 'question-name-pronouns') {
    return 'question-age-selection';
  }
  
  if (currentQuestionId === 'question-age-selection') {
    return 'question-gender-selection';
  }
  
  if (currentQuestionId === 'question-gender-selection') {
    return 'question-orientation-selection';
  }
  
  if (currentQuestionId === 'question-orientation-selection') {
    return 'question-relationship-status';
  }

  // Section 2: Your Relationship (conditional flow based on status)
  if (currentQuestionId === 'question-relationship-status') {
    const status = profileData.relationshipStatus;
    
    if (status === 'Single') {
      return 'question-single-dating';
    } else if (status === 'Talking/Dating') {
      return 'question-talking-length';
    } else if (status === 'In a relationship') {
      return 'question-relationship-length';
    } else if (status === 'Married') {
      return 'question-marriage-length';
    } else if (status === 'Separated') {
      return 'question-separated-length';
    } else if (status === 'Divorced') {
      return 'question-divorced-length';
    } else if (status === 'Widowed') {
      return 'question-widowed-length';
    } else {
      // Default to love language if no specific status handling needed
      return 'question-love-language';
    }
  }

  // Single person flow
  if (currentQuestionId === 'question-single-dating') {
    return 'question-single-why';
  }
  if (currentQuestionId === 'question-single-why') {
    return 'question-love-language';
  }

  // Talking/Dating flow
  if (currentQuestionId === 'question-talking-length') {
    return 'question-talking-challenges';
  }
  if (currentQuestionId === 'question-talking-challenges') {
    return 'question-love-language';
  }

  // Relationship flow
  if (currentQuestionId === 'question-relationship-length') {
    return 'question-relationship-challenges';
  }
  if (currentQuestionId === 'question-relationship-challenges') {
    return 'question-love-language';
  }

  // Marriage flow
  if (currentQuestionId === 'question-marriage-length') {
    return 'question-marriage-challenges';
  }
  if (currentQuestionId === 'question-marriage-challenges') {
    return 'question-love-language';
  }

  // Separated flow
  if (currentQuestionId === 'question-separated-length') {
    return 'question-separated-challenges';
  }
  if (currentQuestionId === 'question-separated-challenges') {
    return 'question-love-language';
  }

  // Divorced flow
  if (currentQuestionId === 'question-divorced-length') {
    return 'question-divorced-challenges';
  }
  if (currentQuestionId === 'question-divorced-challenges') {
    return 'question-love-language';
  }

  // Widowed flow
  if (currentQuestionId === 'question-widowed-length') {
    return 'question-widowed-challenges';
  }
  if (currentQuestionId === 'question-widowed-challenges') {
    return 'question-love-language';
  }

  // Section 3: How You Operate
  if (currentQuestionId === 'question-love-language') {
    return 'question-conflict-style';
  }
  
  if (currentQuestionId === 'question-conflict-style') {
    return 'question-stress-response';
  }
  
  if (currentQuestionId === 'question-stress-response') {
    return 'question-attachment-style';
  }

  // Section 4: Your Foundation
  if (currentQuestionId === 'question-attachment-style') {
    return 'question-family-structure';
  }
  
  if (currentQuestionId === 'question-family-structure') {
    return 'question-heartbreak-betrayal';
  }
  
  if (currentQuestionId === 'question-heartbreak-betrayal') {
    return 'COMPLETE';
  }

  // If we don't recognize the question, try to find a logical next step
  // No-op in production
  return 'COMPLETE';
};