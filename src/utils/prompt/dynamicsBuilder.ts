
import { PersonContext } from "@/types/AIInsights";

export class DynamicsBuilder {
  static buildDynamics(context: PersonContext): string {
    const dynamics = [];
    const partnerName = context.partnerTraits?.name || '';
    
    if (context.dynamics.communicationMatch) {
      dynamics.push("You both communicate similarly, which usually helps");
    } else if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
      dynamics.push(`Your ${context.yourTraits.communicationStyle} style with ${partnerName || 'their'} ${context.partnerTraits.communicationStyle} approach can create interesting dynamics`);
    }
    
    if (context.dynamics.loveLanguageMatch) {
      dynamics.push("You share some love languages, which is sweet");
    } else if (context.dynamics.loveLanguageGap) {
      dynamics.push("Your love languages are different - which is totally normal but worth being aware of");
    }
    
    if (context.yourTraits.conflictStyle && context.partnerTraits.conflictStyle && 
        context.yourTraits.conflictStyle !== context.partnerTraits.conflictStyle) {
      dynamics.push(`When conflicts happen, you ${context.yourTraits.conflictStyle} while ${partnerName || 'they'} ${context.partnerTraits.conflictStyle} - classic dynamic`);
    }
    
    return dynamics.length > 0 ? `\n\nWhat I've noticed about you two: ${dynamics.join('. ')}.` : '';
  }
}
