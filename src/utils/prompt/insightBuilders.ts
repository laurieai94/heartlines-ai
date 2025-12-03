
import { PersonContext } from "@/types/AIInsights";

export class InsightBuilders {
  /**
   * Build comprehensive profile data dump - ALWAYS includes all non-empty profile fields
   * This ensures Kai has access to ALL profile data regardless of conditional portrait logic
   */
  static buildProfileDataDump(context: PersonContext): string {
    const sections: string[] = [];
    
    // User profile - always include all non-empty fields
    if (context.yourTraits) {
      const t = context.yourTraits;
      const userData: string[] = [];
      
      // Identity basics
      if (t.name) userData.push(`name: ${t.name}`);
      if (t.age) userData.push(`age: ${t.age}`);
      if (t.pronouns) userData.push(`pronouns: ${t.pronouns}`);
      if (t.genderIdentity?.length) userData.push(`gender: ${t.genderIdentity.join(', ')}`);
      if (t.sexualOrientation?.length) userData.push(`orientation: ${t.sexualOrientation.join(', ')}`);
      
      // Relationship patterns
      if (t.attachmentStyle) userData.push(`attachment: ${t.attachmentStyle}`);
      if (t.loveLanguages?.length) userData.push(`love languages: ${t.loveLanguages.join(', ')}`);
      if (t.conflictStyle) userData.push(`conflict style: ${t.conflictStyle}`);
      if (t.communicationStyle) userData.push(`communication: ${t.communicationStyle}`);
      if (t.stressResponse?.length) userData.push(`when stressed: ${t.stressResponse.join(', ')}`);
      
      // Past wounds & family
      if (t.heartbreakBetrayal?.length) userData.push(`past wounds: ${t.heartbreakBetrayal.join(', ')}`);
      if (t.familyStructure?.length) userData.push(`family background: ${t.familyStructure.join(', ')}`);
      if (t.parentConflictStyle?.length) userData.push(`parents' conflict: ${t.parentConflictStyle.join(', ')}`);
      if (t.loveMessages?.length) userData.push(`childhood love messages: ${t.loveMessages.join(', ')}`);
      
      // Relationship context
      if (t.datingContext) userData.push(`relationship status: ${t.datingContext}`);
      if (t.relationshipLength) userData.push(`together: ${t.relationshipLength}`);
      if (t.talkingDuration) userData.push(`talking for: ${t.talkingDuration}`);
      
      // Current situation
      if (t.relationshipChallenges?.length) userData.push(`challenges: ${t.relationshipChallenges.join(', ')}`);
      if (t.relationshipWorking?.length) userData.push(`what's working: ${t.relationshipWorking.join(', ')}`);
      if (t.talkingChallenges?.length) userData.push(`talking stage challenges: ${t.talkingChallenges.join(', ')}`);
      if (t.datingChallenges?.length) userData.push(`dating challenges: ${t.datingChallenges.join(', ')}`);
      
      // Goals & hopes
      if (t.hopingFor?.length) userData.push(`hoping for: ${t.hopingFor.join(', ')}`);
      if (t.datingGoals?.length) userData.push(`dating goals: ${t.datingGoals.join(', ')}`);
      if (t.whyRealTalk?.length) userData.push(`why here: ${t.whyRealTalk.join(', ')}`);
      
      // Special situations
      if (t.separationSituation?.length) userData.push(`separation: ${t.separationSituation.join(', ')}`);
      if (t.datingReadiness?.length) userData.push(`dating readiness: ${t.datingReadiness.join(', ')}`);
      if (t.timeSinceLoss) userData.push(`time since loss: ${t.timeSinceLoss}`);
      if (t.grievingProcess?.length) userData.push(`grieving: ${t.grievingProcess.join(', ')}`);
      
      if (userData.length > 0) {
        sections.push(`**${t.name || 'USER'}**: ${userData.join(' | ')}`);
      }
    }
    
    // Partner profile - same comprehensive approach
    if (context.partnerTraits && context.partnerTraits.name) {
      const p = context.partnerTraits;
      const partnerData: string[] = [];
      
      // Identity basics
      if (p.name) partnerData.push(`name: ${p.name}`);
      if (p.age) partnerData.push(`age: ${p.age}`);
      if (p.pronouns) partnerData.push(`pronouns: ${p.pronouns}`);
      if (p.genderIdentity?.length) partnerData.push(`gender: ${p.genderIdentity.join(', ')}`);
      if (p.sexualOrientation?.length) partnerData.push(`orientation: ${p.sexualOrientation.join(', ')}`);
      
      // Relationship patterns
      if (p.attachmentStyle) partnerData.push(`attachment: ${p.attachmentStyle}`);
      if (p.loveLanguages?.length) partnerData.push(`love languages: ${p.loveLanguages.join(', ')}`);
      if (p.conflictStyle) partnerData.push(`conflict style: ${p.conflictStyle}`);
      if (p.communicationStyle) partnerData.push(`communication: ${p.communicationStyle}`);
      if (p.communicationResponse?.length) partnerData.push(`in conversations: ${p.communicationResponse.join(', ')}`);
      if (p.stressResponse?.length) partnerData.push(`when stressed: ${p.stressResponse.join(', ')}`);
      if (p.selfAwareness) partnerData.push(`self-awareness: ${p.selfAwareness}`);
      
      // Past wounds & family
      if (p.heartbreakBetrayal?.length) partnerData.push(`past wounds: ${p.heartbreakBetrayal.join(', ')}`);
      if (p.familyStructure?.length) partnerData.push(`family background: ${p.familyStructure.join(', ')}`);
      
      if (partnerData.length > 0) {
        sections.push(`**${p.name}**: ${partnerData.join(' | ')}`);
      }
    }
    
    // Relationship dynamics
    if (context.relationship) {
      const r = context.relationship;
      const relData: string[] = [];
      
      if (r.length) relData.push(`duration: ${r.length}`);
      if (r.stage) relData.push(`stage: ${r.stage}`);
      if (r.livingArrangement) relData.push(`living: ${r.livingArrangement}`);
      if (r.emotionalConnection) relData.push(`connection: ${r.emotionalConnection}`);
      
      if (relData.length > 0) {
        sections.push(`**RELATIONSHIP**: ${relData.join(' | ')}`);
      }
    }
    
    return sections.length > 0 
      ? `## PROFILE SNAPSHOT (use this data invisibly - never cite it)\n\n${sections.join('\n\n')}`
      : '';
  }
  /**
   * DEPRECATED: Use RelationshipMapper.buildRelationshipPortrait instead
   * Kept for backward compatibility only
   */
  static buildPersonalInsights(context: PersonContext): string {
    if (!context.yourTraits || Object.keys(context.yourTraits).length === 0) return '';
    
    const insights = [];
    const userName = context.yourTraits.name || 'the user';
    
    // Core identity
    if (context.yourTraits.age) insights.push(`${context.yourTraits.age} years old`);
    if (context.yourTraits.pronouns) insights.push(`(${context.yourTraits.pronouns})`);
    
    // Attachment & conflict - the most important patterns
    if (context.yourTraits.attachmentStyle) {
      insights.push(`${context.yourTraits.attachmentStyle} attachment`);
    }
    if (context.yourTraits.conflictStyle) {
      insights.push(`${context.yourTraits.conflictStyle} in conflict`);
    }
    
    // Love languages
    const loveLangs = Array.isArray(context.yourTraits.loveLanguages)
      ? context.yourTraits.loveLanguages
      : (context.yourTraits.loveLanguages ? [context.yourTraits.loveLanguages as any] : []);
    if (loveLangs.length > 0) {
      insights.push(`feels loved through: ${loveLangs.slice(0, 2).join(' + ')}`);
    }
    
    // Past wounds (critical context)
    const heartbreakBetrayal = Array.isArray(context.yourTraits.heartbreakBetrayal)
      ? context.yourTraits.heartbreakBetrayal
      : (context.yourTraits.heartbreakBetrayal ? [context.yourTraits.heartbreakBetrayal as any] : []);
    if (heartbreakBetrayal.length > 0) {
      insights.push(`past: ${heartbreakBetrayal.slice(0, 2).join(', ')}`);
    }
    
    // Relationship context
    if (context.yourTraits.relationshipLength) {
      insights.push(`together ${context.yourTraits.relationshipLength}`);
    }
    
    // Current challenges
    const relChallenges = Array.isArray(context.yourTraits.relationshipChallenges)
      ? context.yourTraits.relationshipChallenges
      : (context.yourTraits.relationshipChallenges ? [context.yourTraits.relationshipChallenges as any] : []);
    if (relChallenges.length > 0) {
      insights.push(`struggling with: ${relChallenges.slice(0, 2).join(', ')}`);
    }
    
    return insights.length > 0 ? `${userName}: ${insights.join(', ')}.` : '';
  }

  /**
   * DEPRECATED: Use RelationshipMapper.buildPartnerPortrait instead
   * Kept for backward compatibility only
   */
  static buildPartnerInsights(context: PersonContext): string {
    if (!context.partnerTraits || Object.keys(context.partnerTraits).length === 0) return '';
    
    const insights = [];
    const partnerName = context.partnerTraits.name || 'their partner';
    
    // Core identity
    if (context.partnerTraits.age) insights.push(`${context.partnerTraits.age} years old`);
    if (context.partnerTraits.pronouns) insights.push(`(${context.partnerTraits.pronouns})`);
    
    // Attachment & conflict patterns
    if (context.partnerTraits.attachmentStyle) {
      insights.push(`${context.partnerTraits.attachmentStyle} attachment`);
    }
    if (context.partnerTraits.conflictStyle) {
      insights.push(`${context.partnerTraits.conflictStyle} in conflict`);
    }
    
    // Love languages
    const partnerLoveLangs = Array.isArray(context.partnerTraits.loveLanguages)
      ? context.partnerTraits.loveLanguages
      : (context.partnerTraits.loveLanguages ? [context.partnerTraits.loveLanguages as any] : []);
    if (partnerLoveLangs.length > 0) {
      insights.push(`feels loved through: ${partnerLoveLangs.slice(0, 2).join(' + ')}`);
    }
    
    // Communication style
    if (context.partnerTraits.communicationStyle) {
      insights.push(`${context.partnerTraits.communicationStyle} communicator`);
    }
    
    return insights.length > 0 ? `${partnerName}: ${insights.join(', ')}.` : '';
  }
  
  /**
   * Build comprehensive profile access test - shows ALL available data
   * Used when user asks Kai to "list everything" or verify data access
   */
  static buildComprehensiveDataTest(context: PersonContext): string {
    const sections = [];
    
    // Personal profile comprehensive test
    if (context.yourTraits && Object.keys(context.yourTraits).length > 0) {
      const personalData = [];
      
      Object.entries(context.yourTraits).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && 
            !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            personalData.push(`${key}: [${value.join(', ')}]`);
          } else if (typeof value === 'object') {
            personalData.push(`${key}: ${JSON.stringify(value)}`);
          } else {
            personalData.push(`${key}: ${value}`);
          }
        }
      });
      
      if (personalData.length > 0) {
        sections.push(`**Your Profile Data (${personalData.length} fields):**\n${personalData.join('\n')}`);
      }
    }
    
    // Partner profile comprehensive test
    if (context.partnerTraits && Object.keys(context.partnerTraits).length > 0) {
      const partnerData = [];
      
      Object.entries(context.partnerTraits).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '' && 
            !(Array.isArray(value) && value.length === 0)) {
          if (Array.isArray(value)) {
            partnerData.push(`${key}: [${value.join(', ')}]`);
          } else if (typeof value === 'object') {
            partnerData.push(`${key}: ${JSON.stringify(value)}`);
          } else {
            partnerData.push(`${key}: ${value}`);
          }
        }
      });
      
      if (partnerData.length > 0) {
        sections.push(`**Partner Profile Data (${partnerData.length} fields):**\n${partnerData.join('\n')}`);
      }
    }
    
    // Relationship context test
    if (context.relationship && Object.keys(context.relationship).length > 0) {
      const relationshipData = [];
      
      Object.entries(context.relationship).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          relationshipData.push(`${key}: ${value}`);
        }
      });
      
      if (relationshipData.length > 0) {
        sections.push(`**Relationship Context (${relationshipData.length} fields):**\n${relationshipData.join('\n')}`);
      }
    }
    
    return sections.length > 0 ? sections.join('\n\n') : 'No profile data available for comprehensive test.';
  }
}
