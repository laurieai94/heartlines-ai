
import { PersonContext } from "@/types/AIInsights";

export class InsightBuilders {
  static buildPersonalInsights(context: PersonContext): string {
    if (!context.yourTraits || Object.keys(context.yourTraits).length === 0) return '';
    
    const insights = [];
    
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
    
    return insights.length > 0 ? insights.join(', ') + '.' : '';
  }

  static buildPartnerInsights(context: PersonContext): string {
    if (!context.partnerTraits || Object.keys(context.partnerTraits).length === 0) return '';
    
    const insights = [];
    const partnerName = context.partnerTraits.name || '';
    
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
    
    
    return insights.length > 0 ? insights.join(', ') + '.' : '';
  }
}
