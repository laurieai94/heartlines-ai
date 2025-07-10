
import { PersonContext } from "@/types/AIInsights";

export class FamilyBackgroundBuilder {
  static buildFamilyBackgroundInsights(context: PersonContext): string {
    const insights = [];
    const partnerName = context.partnerTraits?.name || '';
    
    // Your family background
    if (context.yourTraits.familyBackground) {
      const fb = context.yourTraits.familyBackground;
      
      if (fb.situation?.length > 0) {
        insights.push(`Your family growing up: ${fb.situation[0]}`);
      }
      
      if (fb.emotions?.length > 0) {
        const emotionDesc = fb.emotions.slice(0, 2).join(' and ');
        insights.push(`Emotions in your family: ${emotionDesc}`);
      }
      
      if (fb.conflict?.length > 0) {
        const conflictDesc = fb.conflict.slice(0, 2).join(' and ');
        insights.push(`Family conflict style: ${conflictDesc}`);
      }
      
      if (fb.love?.length > 0) {
        const loveDesc = fb.love.slice(0, 2).join(' and ');
        insights.push(`How love was shown: ${loveDesc}`);
      }
    }
    
    // Partner's family background
    if (context.partnerTraits.familyBackground && partnerName) {
      const pfb = context.partnerTraits.familyBackground;
      
      if (pfb.situation?.length > 0) {
        insights.push(`${partnerName}'s family: ${pfb.situation[0]}`);
      }
      
      if (pfb.emotions?.length > 0) {
        const emotionDesc = pfb.emotions.slice(0, 2).join(' and ');
        insights.push(`${partnerName}'s family emotions: ${emotionDesc}`);
      }
    }
    
    return insights.length > 0 ? `\n\nFamily Origins:\n${insights.join('.\n')}.` : '';
  }
}
