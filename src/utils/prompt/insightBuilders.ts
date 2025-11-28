
import { PersonContext } from "@/types/AIInsights";

export class InsightBuilders {
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
