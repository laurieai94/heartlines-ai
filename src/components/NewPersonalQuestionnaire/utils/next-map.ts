import { ProfileData } from '../types';

// Deterministic question flow - no intersection observers, no complex logic
export const getNextQuestion = (currentQuestionId: string, profileData: ProfileData): string | 'COMPLETE' => {
  
  // Section 1: Who You Are
  if (currentQuestionId === 'question-name-pronouns') {
    return 'question-age';
  }
  
  if (currentQuestionId === 'question-age') {
    return 'question-gender';
  }
  
  if (currentQuestionId === 'question-gender') {
    return 'question-orientation';
  }
  
  if (currentQuestionId === 'question-orientation') {
    return 'question-relationship-status';
  }

  // Section 2: Your Relationship (conditional flow based on status)
  if (currentQuestionId === 'question-relationship-status') {
    const status = profileData.relationshipStatus;
    
    if (status === 'Single') {
      return 'question-dating-challenges';
    } else if (status === 'Talking/Dating') {
      return 'question-talking-description';
    } else if (status === 'In a relationship') {
      return 'question-relationship-length';
    } else if (status === 'Married') {
      return 'question-relationship-length';
    } else if (status === 'Separated') {
      return 'question-separation-situation';
    } else if (status === 'Divorced') {
      return 'question-separation-situation';
    } else if (status === 'Widowed') {
      return 'question-time-since-loss';
    } else {
      // Default to love language if no specific status handling needed
      return 'question-love-language';
    }
  }

  // Single person flow
  if (currentQuestionId === 'question-dating-challenges') {
    return 'question-love-language';
  }

  // Talking/Dating flow
  if (currentQuestionId === 'question-talking-description') {
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
    return 'question-relationship-working';
  }
  if (currentQuestionId === 'question-relationship-working') {
    return 'question-love-language';
  }

  // Separated/Divorced flow
  if (currentQuestionId === 'question-separation-situation') {
    return 'question-dating-readiness';
  }
  if (currentQuestionId === 'question-dating-readiness') {
    return 'question-love-language';
  }

  // Widowed flow
  if (currentQuestionId === 'question-time-since-loss') {
    return 'question-grieving-process';
  }
  if (currentQuestionId === 'question-grieving-process') {
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
  console.warn('Unknown question in next-map:', currentQuestionId);
  return 'COMPLETE';
};