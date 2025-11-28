
import { PersonContext } from "@/types/AIInsights";

export class DynamicsBuilder {
  /**
   * DEPRECATED: Use RelationshipMapper for comprehensive dynamics
   * Kept for backward compatibility only
   */
  static buildDynamics(context: PersonContext): string {
    const userName = context.yourTraits?.name || 'the user';
    const partnerName = context.partnerTraits?.name || 'their partner';
    const dynamics = [];
    
    // Attachment collision pattern
    const userAttachment = context.yourTraits?.attachmentStyle;
    const partnerAttachment = context.partnerTraits?.attachmentStyle;
    
    if (userAttachment === 'anxious' && partnerAttachment === 'avoidant') {
      dynamics.push(`classic anxious-avoidant trap: when ${userName} needs reassurance, ${partnerName} pulls away`);
    } else if (userAttachment && partnerAttachment && userAttachment !== partnerAttachment) {
      dynamics.push(`different attachment styles (${userAttachment} + ${partnerAttachment}) create tension around closeness`);
    }
    
    // Love language dynamics
    const userLoveLangs = Array.isArray(context.yourTraits?.loveLanguages) ? context.yourTraits.loveLanguages : [];
    const partnerLoveLangs = Array.isArray(context.partnerTraits?.loveLanguages) ? context.partnerTraits.loveLanguages : [];
    
    const hasMatch = userLoveLangs.some(l => partnerLoveLangs.includes(l));
    
    if (!hasMatch && userLoveLangs.length > 0 && partnerLoveLangs.length > 0) {
      const userWants = userLoveLangs[0].toLowerCase();
      const partnerGives = partnerLoveLangs[0].toLowerCase();
      dynamics.push(`love language gap: ${userName} craves ${userWants}, ${partnerName} naturally gives ${partnerGives}`);
    }
    
    // Conflict style clash
    const userConflict = context.yourTraits?.conflictStyle;
    const partnerConflict = context.partnerTraits?.conflictStyle;
    
    if (userConflict === 'engage' && partnerConflict === 'avoid') {
      dynamics.push(`conflict escalation pattern: ${userName} pursues, ${partnerName} withdraws`);
    } else if (userConflict === 'avoid' && partnerConflict === 'engage') {
      dynamics.push(`conflict escalation pattern: ${partnerName} pursues, ${userName} withdraws`);
    } else if (userConflict === 'engage' && partnerConflict === 'process') {
      dynamics.push(`timing tension: ${userName} wants to talk now, ${partnerName} needs time to process`);
    }
    
    // Stress response mismatch
    const userStress = Array.isArray(context.yourTraits?.stressResponse) ? context.yourTraits.stressResponse : [];
    const partnerStress = Array.isArray(context.partnerTraits?.stressResponse) ? context.partnerTraits.stressResponse : [];
    
    const userNeedsCloseness = userStress.some(s => s.toLowerCase().includes('cling') || s.toLowerCase().includes('reassurance'));
    const partnerNeedsSpace = partnerStress.some(s => s.toLowerCase().includes('space') || s.toLowerCase().includes('alone'));
    
    if (userNeedsCloseness && partnerNeedsSpace) {
      dynamics.push(`stress response collision: ${userName} needs closeness when stressed, ${partnerName} needs space`);
    }
    
    // Past wound triggers
    const heartbreak = Array.isArray(context.yourTraits?.heartbreakBetrayal) ? context.yourTraits.heartbreakBetrayal : [];
    if (heartbreak.some(h => h.toLowerCase().includes('cheat'))) {
      dynamics.push(`trust sensitivity: past cheating wound makes ${userName} hypervigilant to "off" behavior`);
    }
    
    return dynamics.length > 0 ? `\n\n${dynamics.join('. ')}.` : '';
  }
}
