
import { PersonContext } from "@/types/AIInsights";

export class InsightBuilders {
  static buildPersonalInsights(context: PersonContext): string {
    if (!context.yourTraits || Object.keys(context.yourTraits).length === 0) return '';
    
    const insights = [];
    
    // Basic demographics
    if (context.yourTraits.age) insights.push(`${context.yourTraits.age} years old`);
    if (context.yourTraits.genderIdentity?.length > 0) {
      insights.push(`identifies as ${context.yourTraits.genderIdentity.join(', ')}`);
    }
    if (context.yourTraits.sexualOrientation?.length > 0) {
      const orientationArray = Array.isArray(context.yourTraits.sexualOrientation) 
        ? context.yourTraits.sexualOrientation 
        : [context.yourTraits.sexualOrientation];
      insights.push(`${orientationArray.join(', ')}`);
    }
    
    // Communication & behavioral styles
    if (context.yourTraits.communicationStyle) {
      insights.push(`communicates in a ${context.yourTraits.communicationStyle} way`);
    }
    if (context.yourTraits.attachmentStyle) {
      insights.push(`has ${context.yourTraits.attachmentStyle} attachment`);
    }
    if (context.yourTraits.conflictStyle) {
      const conflictMap = {
        'avoid': 'tends to pull back during conflicts',
        'engage': 'likes to talk things through right away',
        'process': 'needs time to think before discussing conflicts'
      };
      insights.push(conflictMap[context.yourTraits.conflictStyle] || `handles conflict by ${context.yourTraits.conflictStyle}`);
    }
    
    // Love languages & stress response
    const loveLangs = Array.isArray(context.yourTraits.loveLanguages)
      ? context.yourTraits.loveLanguages
      : (context.yourTraits.loveLanguages ? [context.yourTraits.loveLanguages as any] : []);
    if (loveLangs.length > 0) {
      insights.push(`feels loved through: ${loveLangs.join(', ')}`);
    }
    const stressResp = Array.isArray(context.yourTraits.stressResponse)
      ? context.yourTraits.stressResponse
      : (context.yourTraits.stressResponse ? [context.yourTraits.stressResponse as any] : []);
    if (stressResp.length > 0) {
      insights.push(`under stress: ${stressResp.join(', ')}`);
    }
    
    // Relationship context & history
    if (context.relationship?.stage) {
      insights.push(`relationship stage: ${context.relationship.stage}`);
    }
    if (context.yourTraits.relationshipLength) {
      insights.push(`together for ${context.yourTraits.relationshipLength}`);
    }
    if (context.relationship?.livingTogether === true) {
      insights.push('living together');
    }
    
    // Relationship challenges & what's working
    const relChallenges = Array.isArray(context.yourTraits.relationshipChallenges)
      ? context.yourTraits.relationshipChallenges
      : (context.yourTraits.relationshipChallenges ? [context.yourTraits.relationshipChallenges as any] : []);
    if (relChallenges.length > 0) {
      insights.push(`relationship challenges: ${relChallenges.slice(0, 3).join(', ')}`);
    }
    const relWorking = Array.isArray(context.yourTraits.relationshipWorking)
      ? context.yourTraits.relationshipWorking
      : (context.yourTraits.relationshipWorking ? [context.yourTraits.relationshipWorking as any] : []);
    if (relWorking.length > 0) {
      insights.push(`relationship strengths: ${relWorking.slice(0, 3).join(', ')}`);
    }
    
    // Dating context for single/dating individuals
    const datingChallenges = Array.isArray(context.yourTraits.datingChallenges)
      ? context.yourTraits.datingChallenges
      : (context.yourTraits.datingChallenges ? [context.yourTraits.datingChallenges as any] : []);
    if (datingChallenges.length > 0) {
      insights.push(`dating challenges: ${datingChallenges.slice(0, 3).join(', ')}`);
    }
    if (context.yourTraits.talkingDescription) {
      insights.push(`talking stage context: ${context.yourTraits.talkingDescription}`);
    }
    const talkingChallenges = Array.isArray(context.yourTraits.talkingChallenges)
      ? context.yourTraits.talkingChallenges
      : (context.yourTraits.talkingChallenges ? [context.yourTraits.talkingChallenges as any] : []);
    if (talkingChallenges.length > 0) {
      insights.push(`talking stage challenges: ${talkingChallenges.slice(0, 2).join(', ')}`);
    }
    
    // Past relationship history
    const heartbreakBetrayal = Array.isArray(context.yourTraits.heartbreakBetrayal)
      ? context.yourTraits.heartbreakBetrayal
      : (context.yourTraits.heartbreakBetrayal ? [context.yourTraits.heartbreakBetrayal as any] : []);
    if (heartbreakBetrayal.length > 0) {
      insights.push(`past experiences: ${heartbreakBetrayal.join(', ')}`);
    }
    
    // Family background
    const familyStructure = Array.isArray(context.yourTraits.familyStructure)
      ? context.yourTraits.familyStructure
      : (context.yourTraits.familyStructure ? [context.yourTraits.familyStructure as any] : []);
    if (familyStructure.length > 0) {
      insights.push(`family background: ${familyStructure.join(', ')}`);
    }
    
    return insights.length > 0 ? insights.join(', ') + '.' : '';
  }

  static buildPartnerInsights(context: PersonContext): string {
    if (!context.partnerTraits || Object.keys(context.partnerTraits).length === 0) return '';
    
    const insights = [];
    const partnerName = context.partnerTraits.name || '';
    
    // Basic partner demographics
    if (partnerName) insights.push(`${partnerName}`);
    if (context.partnerTraits.age) insights.push(`${context.partnerTraits.age} years old`);
    if (context.partnerTraits.genderIdentity?.length > 0) {
      insights.push(`identifies as ${context.partnerTraits.genderIdentity.join(', ')}`);
    }
    if (context.partnerTraits.sexualOrientation?.length > 0) {
      const orientationArray = Array.isArray(context.partnerTraits.sexualOrientation) 
        ? context.partnerTraits.sexualOrientation 
        : [context.partnerTraits.sexualOrientation];
      insights.push(`${orientationArray.join(', ')}`);
    }
    
    // Partner behavioral styles
    if (context.partnerTraits.communicationStyle) {
      insights.push(`tends to communicate in a ${context.partnerTraits.communicationStyle} way`);
    }
    if (context.partnerTraits.attachmentStyle) {
      insights.push(`has ${context.partnerTraits.attachmentStyle} attachment`);
    }
    if (context.partnerTraits.conflictStyle) {
      const conflictMap = {
        'avoid': 'tends to pull back during conflicts',
        'engage': 'likes to talk things through right away',
        'process': 'needs time to think before discussing conflicts'
      };
      insights.push(conflictMap[context.partnerTraits.conflictStyle] || `handles conflict by ${context.partnerTraits.conflictStyle}`);
    }
    
    // Partner stress & love languages
    const partnerStress = Array.isArray(context.partnerTraits.stressResponse)
      ? context.partnerTraits.stressResponse
      : (context.partnerTraits.stressResponse ? [context.partnerTraits.stressResponse as any] : []);
    if (partnerStress.length > 0) {
      insights.push(`under stress: ${partnerStress.join(', ')}`);
    }
    const partnerLoveLangs = Array.isArray(context.partnerTraits.loveLanguages)
      ? context.partnerTraits.loveLanguages
      : (context.partnerTraits.loveLanguages ? [context.partnerTraits.loveLanguages as any] : []);
    if (partnerLoveLangs.length > 0) {
      insights.push(`feels loved through: ${partnerLoveLangs.join(', ')}`);
    }
    
    // Partner communication & self-awareness details
    const commResponse = Array.isArray(context.partnerTraits.communicationResponse)
      ? context.partnerTraits.communicationResponse
      : (context.partnerTraits.communicationResponse ? [context.partnerTraits.communicationResponse as any] : []);
    if (commResponse.length > 0) {
      insights.push(`communication response style: ${commResponse.join(', ')}`);
    }
    if (context.partnerTraits.selfAwareness) {
      insights.push(`self-awareness level: ${context.partnerTraits.selfAwareness}`);
    }
    
    // Partner past experiences
    const partnerHeartbreakBetrayal = Array.isArray(context.partnerTraits.heartbreakBetrayal)
      ? context.partnerTraits.heartbreakBetrayal
      : (context.partnerTraits.heartbreakBetrayal ? [context.partnerTraits.heartbreakBetrayal as any] : []);
    if (partnerHeartbreakBetrayal.length > 0) {
      insights.push(`past experiences: ${partnerHeartbreakBetrayal.join(', ')}`);
    }
    
    // Partner family background
    const partnerFamilyStructure = Array.isArray(context.partnerTraits.familyStructure)
      ? context.partnerTraits.familyStructure
      : (context.partnerTraits.familyStructure ? [context.partnerTraits.familyStructure as any] : []);
    if (partnerFamilyStructure.length > 0) {
      insights.push(`family background: ${partnerFamilyStructure.join(', ')}`);
    }
    
    return insights.length > 0 ? insights.join(', ') + '.' : '';
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
