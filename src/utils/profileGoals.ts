import { PersonalProfileV2, PartnerProfileV2 } from '@/hooks/useProfileStoreV2';

/**
 * Profile Goals Utility - Derives relationship goals from existing profile data
 * This utility analyzes user responses to infer their relationship goals and priorities
 */

export interface ProfileGoals {
  primary: string[];
  secondary: string[];
  challenges: string[];
  growthAreas: string[];
}

export interface DerivedGoals {
  personal: ProfileGoals;
  relationship: ProfileGoals;
  communication: ProfileGoals;
}

export class ProfileGoalsUtility {
  /**
   * Derive goals from personal profile data
   */
  static derivePersonalGoals(profile: PersonalProfileV2): DerivedGoals {
    const personal = this.derivePersonalProfileGoals(profile);
    const relationship = this.deriveRelationshipGoals(profile);
    const communication = this.deriveCommunicationGoals(profile);

    return { personal, relationship, communication };
  }

  /**
   * Derive partner-related goals from partner profile
   */
  static derivePartnerGoals(profile: PartnerProfileV2): ProfileGoals {
    const primary: string[] = [];
    const secondary: string[] = [];
    const challenges: string[] = [];
    const growthAreas: string[] = [];

    // Derive from love language preferences
    if (profile.partnerLoveLanguage.includes('Support my goals and dreams')) {
      primary.push('Mutual goal support');
    }

    // Derive from communication style
    if (profile.partnerCommunicationResponse.includes('Direct, clear communication')) {
      secondary.push('Improve communication clarity');
    }

    // Derive from self-awareness level
    if (profile.partnerSelfAwareness === 'Still learning about themselves') {
      growthAreas.push('Support partner\'s self-discovery');
    }

    return { primary, secondary, challenges, growthAreas };
  }

  private static derivePersonalProfileGoals(profile: PersonalProfileV2): ProfileGoals {
    const primary: string[] = [];
    const secondary: string[] = [];
    const challenges: string[] = [];
    const growthAreas: string[] = [];

    // Derive from love language
    if (profile.loveLanguage.includes('Having them support my dreams and goals')) {
      primary.push('Build mutual goal support');
    }
    if (profile.loveLanguage.includes('Quality time without distractions')) {
      primary.push('Increase quality time together');
    }

    // Derive from stress response patterns
    if (profile.stressResponse.includes('Try to fix everything immediately')) {
      growthAreas.push('Learn to sit with difficult emotions');
    }
    if (profile.stressResponse.includes('Go quiet and disappear')) {
      growthAreas.push('Improve communication during stress');
    }

    // Derive from attachment style
    if (profile.attachmentStyle === 'Anxious') {
      secondary.push('Build security in relationship');
      growthAreas.push('Develop emotional regulation skills');
    }
    if (profile.attachmentStyle === 'Avoidant') {
      growthAreas.push('Increase emotional intimacy');
    }

    return { primary, secondary, challenges, growthAreas };
  }

  private static deriveRelationshipGoals(profile: PersonalProfileV2): ProfileGoals {
    const primary: string[] = [];
    const secondary: string[] = [];
    const challenges: string[] = [];
    const growthAreas: string[] = [];

    // Derive from relationship challenges
    profile.relationshipChallenges.forEach(challenge => {
      switch (challenge) {
        case 'Communication breakdowns':
          primary.push('Improve communication patterns');
          break;
        case 'Different future goals':
          primary.push('Align on shared future vision');
          break;
        case 'Trust/intimacy issues':
          primary.push('Rebuild trust and intimacy');
          break;
        case 'Balancing time & priorities':
          secondary.push('Better time management as couple');
          break;
        default:
          challenges.push(`Address: ${challenge}`);
      }
    });

    // Derive from what's working well
    profile.relationshipWorking.forEach(strength => {
      if (strength.includes('goal')) {
        secondary.push('Maintain goal alignment');
      }
      if (strength.includes('communication')) {
        secondary.push('Maintain strong communication');
      }
    });

    // Derive from dating challenges for single users
    profile.datingChallenges.forEach(challenge => {
      switch (challenge) {
        case 'Finding genuine connections':
          primary.push('Build authentic relationships');
          break;
        case 'Being vulnerable/opening up':
          growthAreas.push('Increase emotional vulnerability');
          break;
        case 'Setting healthy boundaries':
          growthAreas.push('Develop boundary-setting skills');
          break;
        default:
          challenges.push(`Dating: ${challenge}`);
      }
    });

    return { primary, secondary, challenges, growthAreas };
  }

  private static deriveCommunicationGoals(profile: PersonalProfileV2): ProfileGoals {
    const primary: string[] = [];
    const secondary: string[] = [];
    const challenges: string[] = [];
    const growthAreas: string[] = [];

    // Derive from conflict style
    profile.conflictStyle.forEach(style => {
      switch (style) {
        case 'Space to cool down first':
          secondary.push('Balance space needs with connection');
          break;
        case 'To feel heard before anything else':
          primary.push('Develop active listening skills');
          break;
        case 'Direct, clear communication':
          secondary.push('Maintain direct communication');
          break;
        case 'Haven\'t had enough fights to know yet':
          growthAreas.push('Learn healthy conflict patterns');
          break;
      }
    });

    return { primary, secondary, challenges, growthAreas };
  }

  /**
   * Get consolidated goals summary for AI prompt
   */
  static getGoalsSummary(derivedGoals: DerivedGoals): string[] {
    const allGoals = [
      ...derivedGoals.personal.primary,
      ...derivedGoals.relationship.primary,
      ...derivedGoals.communication.primary,
      ...derivedGoals.personal.secondary,
      ...derivedGoals.relationship.secondary,
      ...derivedGoals.communication.secondary
    ];

    // Remove duplicates and return unique goals
    return [...new Set(allGoals)];
  }

  /**
   * Get priority challenges for coaching focus
   */
  static getPriorityChallenges(derivedGoals: DerivedGoals): string[] {
    const allChallenges = [
      ...derivedGoals.personal.challenges,
      ...derivedGoals.relationship.challenges,
      ...derivedGoals.communication.challenges,
      ...derivedGoals.personal.growthAreas,
      ...derivedGoals.relationship.growthAreas,
      ...derivedGoals.communication.growthAreas
    ];

    // Remove duplicates and return unique challenges
    return [...new Set(allChallenges)];
  }
}