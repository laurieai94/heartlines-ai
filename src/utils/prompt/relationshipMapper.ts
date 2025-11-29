
import { PersonContext } from "@/types/AIInsights";

export class RelationshipMapper {
  /**
   * Creates an integrated relationship portrait showing how user and partner interact
   */
  static buildRelationshipPortrait(context: PersonContext): string {
    const userName = context.yourTraits?.name || 'the user';
    const partnerName = context.partnerTraits?.name || 'their partner';
    
    const sections = [];
    
    // Relationship context (stage, duration, status) - appears first
    const relationshipContext = this.buildRelationshipContext(context, userName, partnerName);
    if (relationshipContext) sections.push(relationshipContext);
    
    // User's core pattern
    const userPattern = this.buildPersonPattern(context.yourTraits, userName, true);
    if (userPattern) sections.push(userPattern);
    
    // Partner's core pattern
    const partnerPattern = this.buildPersonPattern(context.partnerTraits, partnerName, false);
    if (partnerPattern) sections.push(partnerPattern);
    
    // How they interact together
    const interactionDynamics = this.buildInteractionDynamics(context, userName, partnerName);
    if (interactionDynamics) sections.push(interactionDynamics);
    
    // What to expect
    const expectations = this.buildExpectations(context, userName, partnerName);
    if (expectations) sections.push(expectations);
    
    return sections.length > 0 ? sections.join('\n\n') : '';
  }
  
  /**
   * Build relationship context - stage, duration, and current challenges
   */
  private static buildRelationshipContext(context: PersonContext, userName: string, partnerName: string): string {
    const parts = [];
    
    // Relationship status (talking stage, in a relationship, etc.)
    const status = context.yourTraits?.datingContext || context.relationship?.length;
    if (status) {
      parts.push(`relationship status: ${status}`);
    }
    
    // Duration - check both talkingDuration and relationshipLength
    const talkingDuration = context.yourTraits?.talkingDuration;
    const relationshipLength = context.yourTraits?.relationshipLength;
    
    if (talkingDuration) {
      parts.push(`they've been talking for: ${talkingDuration}`);
    } else if (relationshipLength) {
      parts.push(`together for: ${relationshipLength}`);
    }
    
    // Talking stage description (if applicable)
    const talkingDesc = context.yourTraits?.talkingDescription;
    if (Array.isArray(talkingDesc) && talkingDesc.length > 0) {
      parts.push(`the vibe: ${talkingDesc.join(', ')}`);
    }
    
    // Current challenges
    const talkingChallenges = context.yourTraits?.talkingChallenges;
    const relationshipChallenges = context.yourTraits?.relationshipChallenges;
    
    if (Array.isArray(talkingChallenges) && talkingChallenges.length > 0) {
      parts.push(`what's on their mind: ${talkingChallenges.join(', ')}`);
    } else if (Array.isArray(relationshipChallenges) && relationshipChallenges.length > 0) {
      parts.push(`current challenges: ${relationshipChallenges.join(', ')}`);
    }
    
    if (parts.length === 0) return '';
    
    return `**relationship context:**\n- ${parts.join('\n- ')}`;
  }
  
  /**
   * Build a person's core pattern (user or partner)
   */
  private static buildPersonPattern(traits: any, name: string, isUser: boolean): string {
    if (!traits || Object.keys(traits).length === 0) return '';
    
    const parts = [];
    
    // Attachment style
    if (traits.attachmentStyle) {
      parts.push(`has ${traits.attachmentStyle} attachment`);
    }
    
    // Love languages
    const loveLangs = Array.isArray(traits.loveLanguages) ? traits.loveLanguages : [];
    if (loveLangs.length > 0) {
      parts.push(`feels loved through ${loveLangs.slice(0, 2).join(' + ')}`);
    }
    
    // Stress response
    const stressResp = Array.isArray(traits.stressResponse) ? traits.stressResponse : [];
    if (stressResp.length > 0) {
      const stressDesc = stressResp[0].toLowerCase();
      if (stressDesc.includes('cling') || stressDesc.includes('reassurance')) {
        parts.push(`when stressed, they get clingy/need reassurance`);
      } else if (stressDesc.includes('space') || stressDesc.includes('alone') || stressDesc.includes('withdraw')) {
        parts.push(`when stressed, they go quiet and need space`);
      } else if (stressDesc.includes('busy') || stressDesc.includes('distract')) {
        parts.push(`when stressed, they stay busy/distracted`);
      } else {
        parts.push(`when stressed: ${stressDesc}`);
      }
    }
    
    // Conflict style
    if (traits.conflictStyle) {
      if (traits.conflictStyle === 'avoid') {
        parts.push(`in conflict, they avoid until it explodes`);
      } else if (traits.conflictStyle === 'engage') {
        parts.push(`in conflict, they want to talk it through right away`);
      } else if (traits.conflictStyle === 'process') {
        parts.push(`in conflict, they shut down and need time`);
      }
    }
    
    // Family background context (for user only)
    if (isUser && traits.familyBackground) {
      const fb = traits.familyBackground;
      if (fb.emotions?.length > 0) {
        const emotionDesc = fb.emotions[0].toLowerCase();
        if (emotionDesc.includes("weren't talked about") || emotionDesc.includes('suppressed')) {
          parts.push(`they grew up in a house where emotions weren't talked about—so big feelings feel dangerous`);
        }
      }
    }
    
    // Past wounds
    const heartbreak = Array.isArray(traits.heartbreakBetrayal) ? traits.heartbreakBetrayal : [];
    if (heartbreak.length > 0) {
      if (heartbreak.some(h => h.toLowerCase().includes('cheat'))) {
        parts.push(`past wound: been cheated on before. this makes trust harder and "off" behavior hit different`);
      } else if (heartbreak.some(h => h.toLowerCase().includes('abandon'))) {
        parts.push(`past wound: been abandoned before. this makes inconsistency feel threatening`);
      }
    }
    
    // Partner-specific notes
    if (!isUser) {
      // Sexual orientation context
      const orientation = Array.isArray(traits.sexualOrientation) ? traits.sexualOrientation : [];
      if (orientation.some(o => o.toLowerCase().includes('bi'))) {
        parts.push(`they're bi—which ${name === 'their partner' ? 'their partner' : 'the user'} sometimes worries about`);
      }
      
      // Communication style
      if (traits.communicationStyle === 'direct') {
        parts.push(`they're straightforward but not always great at emotional check-ins`);
      } else if (traits.communicationStyle === 'indirect') {
        parts.push(`they hint rather than stating needs directly`);
      }
      
      // How they show love
      const partnerLoveLangs = Array.isArray(traits.loveLanguages) ? traits.loveLanguages : [];
      if (partnerLoveLangs.some(l => l.toLowerCase().includes('acts of service'))) {
        parts.push(`shows love through doing things`);
      }
    }
    
    if (parts.length === 0) return '';
    
    const label = isUser ? `**${name}'s core pattern:**` : `**${name}'s core pattern:**`;
    return `${label}\n${name} ${parts.join('. ')}.`;
  }
  
  /**
   * Build interaction dynamics between user and partner
   */
  private static buildInteractionDynamics(context: PersonContext, userName: string, partnerName: string): string {
    const dynamics = [];
    
    // Attachment collision
    const userAttachment = context.yourTraits?.attachmentStyle;
    const partnerAttachment = context.partnerTraits?.attachmentStyle;
    
    if (userAttachment === 'anxious' && partnerAttachment === 'avoidant') {
      dynamics.push(`when ${userName} needs reassurance, ${partnerName} pulls away → classic anxious-avoidant trap`);
    } else if (userAttachment === 'avoidant' && partnerAttachment === 'anxious') {
      dynamics.push(`when ${partnerName} needs reassurance, ${userName} pulls away → classic anxious-avoidant trap`);
    }
    
    // Love language mismatch
    const userLoveLangs = Array.isArray(context.yourTraits?.loveLanguages) ? context.yourTraits.loveLanguages : [];
    const partnerLoveLangs = Array.isArray(context.partnerTraits?.loveLanguages) ? context.partnerTraits.loveLanguages : [];
    
    const userWantsWords = userLoveLangs.some(l => l.toLowerCase().includes('words'));
    const partnerGivesActions = partnerLoveLangs.some(l => l.toLowerCase().includes('acts of service'));
    
    if (userWantsWords && partnerGivesActions) {
      dynamics.push(`${userName} wants verbal affirmation; ${partnerName} shows love through action → misread intentions`);
    }
    
    // Conflict style clash
    const userConflict = context.yourTraits?.conflictStyle;
    const partnerConflict = context.partnerTraits?.conflictStyle;
    
    if (userConflict === 'engage' && partnerConflict === 'avoid') {
      dynamics.push(`in conflict: ${userName} pursues, ${partnerName} withdraws → escalation pattern`);
    } else if (userConflict === 'avoid' && partnerConflict === 'engage') {
      dynamics.push(`in conflict: ${partnerName} pursues, ${userName} withdraws → escalation pattern`);
    } else if (userConflict === 'engage' && partnerConflict === 'process') {
      dynamics.push(`in conflict: ${userName} wants to talk now, ${partnerName} needs time → timing mismatch`);
    }
    
    // Strength - when it works
    if (userLoveLangs.some(l => l.toLowerCase().includes('quality time')) && 
        context.relationship?.stage !== 'single') {
      dynamics.push(`strength: when ${partnerName} does give quality time, it lands hard for ${userName}`);
    }
    
    if (dynamics.length === 0) return '';
    
    return `**how these two interact:**\n- ${dynamics.join('\n- ')}`;
  }
  
  /**
   * Build expectations section - what patterns to watch for
   */
  private static buildExpectations(context: PersonContext, userName: string, partnerName: string): string {
    const expectations = [];
    
    // Trust spirals
    const heartbreak = Array.isArray(context.yourTraits?.heartbreakBetrayal) ? context.yourTraits.heartbreakBetrayal : [];
    const partnerOrientation = Array.isArray(context.partnerTraits?.sexualOrientation) ? context.partnerTraits.sexualOrientation : [];
    
    if (heartbreak.some(h => h.toLowerCase().includes('cheat')) && 
        partnerOrientation.some(o => o.toLowerCase().includes('bi'))) {
      expectations.push(`trust spirals (cheating history + bi partner anxiety)`);
    } else if (heartbreak.some(h => h.toLowerCase().includes('cheat'))) {
      expectations.push(`trust spirals from past cheating wound`);
    }
    
    // Anxiety patterns
    if (context.yourTraits?.attachmentStyle === 'anxious') {
      expectations.push(`"are we okay?" anxiety from ${userName}`);
    }
    
    // Space/rejection confusion
    if (context.yourTraits?.attachmentStyle === 'anxious' && context.partnerTraits?.attachmentStyle === 'avoidant') {
      expectations.push(`${partnerName} needing space reading as rejection`);
    }
    
    // Communication gaps
    const userLoveLangs = Array.isArray(context.yourTraits?.loveLanguages) ? context.yourTraits.loveLanguages : [];
    const partnerLoveLangs = Array.isArray(context.partnerTraits?.loveLanguages) ? context.partnerTraits.loveLanguages : [];
    
    if (!userLoveLangs.some(l => partnerLoveLangs.includes(l))) {
      expectations.push(`communication mismatches around needs`);
    }
    
    if (expectations.length === 0) return '';
    
    return `**what to expect:**\n- ${expectations.join('\n- ')}`;
  }
  
  /**
   * Build partner portrait - showing you understand them as a person
   */
  static buildPartnerPortrait(context: PersonContext): string {
    const partnerName = context.partnerTraits?.name || 'their partner';
    const userName = context.yourTraits?.name || 'the user';
    
    if (!context.partnerTraits || Object.keys(context.partnerTraits).length === 0) return '';
    
    const understanding = [];
    
    // How they show love
    const loveLangs = Array.isArray(context.partnerTraits.loveLanguages) ? context.partnerTraits.loveLanguages : [];
    if (loveLangs.some(l => l.toLowerCase().includes('acts of service'))) {
      understanding.push(`shows love through doing, not saying`);
    }
    
    // Stress response
    const stressResp = Array.isArray(context.partnerTraits.stressResponse) ? context.partnerTraits.stressResponse : [];
    if (stressResp.some(s => s.toLowerCase().includes('space') || s.toLowerCase().includes('alone'))) {
      understanding.push(`needs space when overwhelmed (not rejecting, processing)`);
    }
    
    // Communication awareness
    const userLoveLangs = Array.isArray(context.yourTraits?.loveLanguages) ? context.yourTraits.loveLanguages : [];
    if (userLoveLangs.some(l => l.toLowerCase().includes('words')) && 
        !loveLangs.some(l => l.toLowerCase().includes('words'))) {
      understanding.push(`might not realize when ${userName} needs verbal reassurance`);
    }
    
    // Their history
    const partnerHeartbreak = Array.isArray(context.partnerTraits.heartbreakBetrayal) ? context.partnerTraits.heartbreakBetrayal : [];
    if (partnerHeartbreak.length > 0) {
      understanding.push(`has their own history that affects how they show up`);
    }
    
    if (understanding.length === 0) return '';
    
    return `**reading ${partnerName}:**\nbased on what ${userName} has shared, ${partnerName} sounds like someone who:\n- ${understanding.join('\n- ')}`;
  }
  
  /**
   * Build friction points - where conflict likely arises
   */
  static buildFrictionPoints(context: PersonContext): string {
    const userName = context.yourTraits?.name || 'the user';
    const partnerName = context.partnerTraits?.name || 'their partner';
    
    const frictions = [];
    
    // Trust & security
    const heartbreak = Array.isArray(context.yourTraits?.heartbreakBetrayal) ? context.yourTraits.heartbreakBetrayal : [];
    const partnerOrientation = Array.isArray(context.partnerTraits?.sexualOrientation) ? context.partnerTraits.sexualOrientation : [];
    
    if (heartbreak.some(h => h.toLowerCase().includes('cheat'))) {
      if (partnerOrientation.some(o => o.toLowerCase().includes('bi'))) {
        frictions.push(`**trust & security**: ${userName}'s cheating history + ${partnerName}'s independence/orientation = anxiety triggers`);
      } else {
        frictions.push(`**trust & security**: ${userName}'s cheating history makes them hypervigilant to "off" behavior`);
      }
    }
    
    // Emotional availability
    const userWantsCheckins = context.yourTraits?.attachmentStyle === 'anxious';
    const partnerAvoids = context.partnerTraits?.attachmentStyle === 'avoidant';
    
    if (userWantsCheckins && partnerAvoids) {
      frictions.push(`**emotional availability**: ${userName} wants check-ins, ${partnerName} assumes no news = good news`);
    }
    
    // Conflict timing
    const userConflict = context.yourTraits?.conflictStyle;
    const partnerConflict = context.partnerTraits?.conflictStyle;
    
    if (userConflict === 'engage' && (partnerConflict === 'avoid' || partnerConflict === 'process')) {
      frictions.push(`**conflict timing**: ${userName} wants to talk now, ${partnerName} needs to cool down first`);
    }
    
    // Showing love
    const userLoveLangs = Array.isArray(context.yourTraits?.loveLanguages) ? context.yourTraits.loveLanguages : [];
    const partnerLoveLangs = Array.isArray(context.partnerTraits?.loveLanguages) ? context.partnerTraits.loveLanguages : [];
    
    const userWantsQualityTime = userLoveLangs.some(l => l.toLowerCase().includes('quality time'));
    const partnerGivesActions = partnerLoveLangs.some(l => l.toLowerCase().includes('acts of service'));
    
    if (userWantsQualityTime && partnerGivesActions) {
      frictions.push(`**showing love**: ${userName} craves quality time, ${partnerName} shows love through acts of service`);
    }
    
    if (frictions.length === 0) return '';
    
    return `**likely friction points for ${userName} + ${partnerName}:**\n${frictions.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n**use these to connect dots in conversation—without citing them directly.**`;
  }
}
