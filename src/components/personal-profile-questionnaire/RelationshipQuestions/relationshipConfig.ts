
export const challengeOptions = [
  'Communication breakdowns',
  'Finding quality people',
  'Trust/intimacy issues',
  'Balancing time & priorities',
  'Different future goals',
  'Family/friend drama',
  'Dating app fatigue',
  'Getting over an ex',
  'Money/financial stress'
];

export const getRelationshipLengthConfig = (relationshipStatus?: string) => {
  switch (relationshipStatus) {
    case 'Talking to someone':
    case 'Talking stage':
    case 'Soft launching someone new':
    case 'Engaged': // Skip length question for Engaged users (already answered in main form)
      return null;
    case 'Married':
      return {
        label: 'How long have you been married?',
        options: [
          'Less than 1 year',
          '1-3 years',
          '3-5 years',
          '5-10 years',
          '10-20 years',
          '20+ years'
        ]
      };
    case 'Domestic partnership':
      return {
        label: 'How long have you been in a domestic partnership?',
        options: [
          'Less than 1 year',
          '1-3 years',
          '3-5 years',
          '5-10 years',
          '10-20 years',
          '20+ years'
        ]
      };
    case 'Separated/Divorced':
      return {
        label: 'How long were you together?',
        options: [
          'Less than 1 year',
          '1-3 years',
          '3-5 years',
          '5-10 years',
          '10-20 years',
          '20+ years'
        ]
      };
    case 'It\'s complicated':
    case 'Situationship':
      return {
        label: 'How long have you known each other?',
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6 months - 1 year',
          '1-2 years',
          '2-5 years',
          '5+ years'
        ]
      };
    default: // In a relationship
      return {
        label: 'How long have you been together?',
        options: [
          'Less than 1 month',
          '1-3 months',
          '3-6 months',
          '6 months - 1 year',
          '1-2 years',
          '2-5 years',
          '5-10 years',
          '10+ years'
        ]
      };
  }
};

export const getWorkingWellConfig = (relationshipStatus?: string) => {
  switch (relationshipStatus) {
    case 'Talking to someone':
    case 'Talking stage':
    case 'Soft launching someone new':
      return {
        label: 'What\'s going well so far?',
        subtitle: 'Early connections that feel promising',
        options: [
          'Easy conversation flow',
          'Shared sense of humor',
          'Similar values coming through',
          'Good texting rhythm',
          'Mutual effort and interest',
          'Comfortable being ourselves',
          'Exciting chemistry',
          'Respectful boundaries',
          'Fun and light energy'
        ]
      };
    case 'Separated/Divorced':
      return {
        label: 'What are your priorities now?',
        subtitle: 'Focus areas for moving forward',
        options: [
          'Healing and self-care',
          'Co-parenting effectively',
          'Rediscovering myself',
          'Building new friendships',
          'Career and financial stability',
          'Learning from past patterns',
          'Setting healthy boundaries',
          'Eventually dating again',
          'Creating a stable routine'
        ]
      };
    case 'It\'s complicated':
    case 'Situationship':
      return {
        label: 'What\'s working despite the complications?',
        subtitle: 'The good parts worth acknowledging',
        options: [
          'Strong emotional connection',
          'Great communication when we talk',
          'Shared understanding',
          'Mutual respect for the situation',
          'Good physical connection',
          'Supporting each other',
          'Honest about the challenges',
          'Taking things day by day',
          'Both trying to figure it out'
        ]
      };
    case 'Married':
      return {
        label: 'What\'s working well in your marriage?',
        subtitle: 'The foundations that keep you strong',
        options: [
          'Deep trust and commitment',
          'Great communication',
          'Strong physical connection',
          'Shared life goals',
          'Good teamwork on daily life',
          'Emotional support',
          'Maintaining individual interests',
          'Handling conflict well',
          'Growing together over time'
        ]
      };
    case 'Domestic partnership':
      return {
        label: 'What\'s working well in your domestic partnership?',
        subtitle: 'The foundations that keep you strong',
        options: [
          'Deep trust and commitment',
          'Great communication',
          'Strong physical connection',
          'Shared life goals',
          'Good teamwork on daily life',
          'Emotional support',
          'Maintaining individual interests',
          'Handling conflict well',
          'Growing together over time'
        ]
      };
    case 'Engaged':
      return {
        label: 'What\'s working well as you plan your future?',
        subtitle: 'Strengths you\'re building on',
        options: [
          'Excited about the future together',
          'Great communication',
          'Strong physical connection',
          'Aligned on major life decisions',
          'Good conflict resolution',
          'Family and friend support',
          'Shared values and goals',
          'Trust and honesty',
          'Planning wedding together well'
        ]
      };
    default: // In a relationship
      return {
        label: 'What\'s actually working well?',
        subtitle: 'Let\'s celebrate the good stuff too',
        options: [
          'Great communication',
          'Strong physical connection',
          'Shared values/goals',
          'Fun and laughter',
          'Good conflict resolution',
          'Emotional support',
          'Trust and honesty',
          'Respect for differences',
          'Similar life priorities'
        ]
      };
  }
};
