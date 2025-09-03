import { DerivedGoals, ProfileGoals } from '@/utils/profileGoals';

/**
 * Goals Builder - Constructs goal-focused insights for AI prompts
 * Translates derived goals into coaching-focused prompt sections
 */

export class GoalsBuilder {
  /**
   * Build goals section for AI prompt
   */
  static buildGoalsInsights(
    derivedGoals: DerivedGoals | null,
    partnerGoals: ProfileGoals | null,
    goalsSummary: string[],
    priorityChallenges: string[]
  ): string {
    if (!derivedGoals && !partnerGoals) {
      return '';
    }

    let goalsSection = '\n## RELATIONSHIP GOALS & PRIORITIES\n\n';

    // Add primary goals
    if (goalsSummary.length > 0) {
      goalsSection += '**Primary Relationship Goals:**\n';
      goalsSummary.slice(0, 5).forEach(goal => {
        goalsSection += `- ${goal}\n`;
      });
      goalsSection += '\n';
    }

    // Add priority challenges
    if (priorityChallenges.length > 0) {
      goalsSection += '**Priority Growth Areas:**\n';
      priorityChallenges.slice(0, 5).forEach(challenge => {
        goalsSection += `- ${challenge}\n`;
      });
      goalsSection += '\n';
    }

    // Add detailed goals breakdown if available
    if (derivedGoals) {
      goalsSection += this.buildDetailedGoalsBreakdown(derivedGoals);
    }

    // Add partner goals context if available
    if (partnerGoals) {
      goalsSection += this.buildPartnerGoalsContext(partnerGoals);
    }

    // Add coaching guidance
    goalsSection += this.buildCoachingGuidance(goalsSummary, priorityChallenges);

    return goalsSection;
  }

  private static buildDetailedGoalsBreakdown(derivedGoals: DerivedGoals): string {
    let section = '**Goals Breakdown:**\n';

    // Personal goals
    if (derivedGoals.personal.primary.length > 0) {
      section += `Personal Focus: ${derivedGoals.personal.primary.join(', ')}\n`;
    }

    // Relationship goals  
    if (derivedGoals.relationship.primary.length > 0) {
      section += `Relationship Focus: ${derivedGoals.relationship.primary.join(', ')}\n`;
    }

    // Communication goals
    if (derivedGoals.communication.primary.length > 0) {
      section += `Communication Focus: ${derivedGoals.communication.primary.join(', ')}\n`;
    }

    return section + '\n';
  }

  private static buildPartnerGoalsContext(partnerGoals: ProfileGoals): string {
    let section = '**Partner Considerations:**\n';

    if (partnerGoals.primary.length > 0) {
      section += `Partner needs support with: ${partnerGoals.primary.join(', ')}\n`;
    }

    if (partnerGoals.growthAreas.length > 0) {
      section += `Partner growth opportunities: ${partnerGoals.growthAreas.join(', ')}\n`;
    }

    return section + '\n';
  }

  private static buildCoachingGuidance(
    goalsSummary: string[],
    priorityChallenges: string[]
  ): string {
    let guidance = '**Coaching Guidance:**\n';

    if (goalsSummary.length > 0) {
      guidance += '- Focus conversations on actionable steps toward their stated goals\n';
      guidance += '- Help them identify patterns that support or hinder goal achievement\n';
    }

    if (priorityChallenges.length > 0) {
      guidance += '- Address growth areas with compassion and specific strategies\n';
      guidance += '- Help them see challenges as opportunities for deeper connection\n';
    }

    guidance += '- Always tie insights back to their relationship goals and priorities\n';
    guidance += '- Celebrate progress toward their identified goals\n\n';

    return guidance;
  }

  /**
   * Build a concise goals summary for quick reference
   */
  static buildGoalsSummary(goalsSummary: string[]): string {
    if (goalsSummary.length === 0) {
      return 'No specific relationship goals identified yet - help them clarify their priorities.';
    }

    if (goalsSummary.length <= 3) {
      return `Key goals: ${goalsSummary.join(', ')}`;
    }

    return `Primary goals: ${goalsSummary.slice(0, 3).join(', ')} (plus ${goalsSummary.length - 3} others)`;
  }

  /**
   * Build challenges summary for coaching focus
   */
  static buildChallengesSummary(priorityChallenges: string[]): string {
    if (priorityChallenges.length === 0) {
      return 'No specific challenges identified - focus on prevention and growth.';
    }

    if (priorityChallenges.length <= 3) {
      return `Key challenges: ${priorityChallenges.join(', ')}`;
    }

    return `Main challenges: ${priorityChallenges.slice(0, 3).join(', ')} (plus ${priorityChallenges.length - 3} others)`;
  }
}