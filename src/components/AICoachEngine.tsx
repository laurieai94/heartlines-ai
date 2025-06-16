import { PersonContext, ChatMessage } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: any, demographicsData: any): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemographics = demographicsData.your || {};
    const partnerDemographics = demographicsData.partner || {};

    return {
      relationship: {
        length: yourDemographics.relationshipLength || undefined,
        livingTogether: yourDemographics.livingTogether || false,
        stage: yourDemographics.relationshipStage || undefined
      },
      yourTraits: {
        name: yourDemographics.name || undefined,
        loveLanguage: yourProfile.loveLanguage || undefined,
        communicationStyle: yourProfile.communicationStyle || undefined,
        conflictStyle: yourProfile.conflictStyle || undefined,
        stressResponse: yourProfile.stressResponse || undefined,
        attachmentStyle: yourProfile.attachmentStyle || undefined,
        triggers: yourProfile.triggers || [],
        strengths: yourProfile.strengths || [],
        growthAreas: yourProfile.growthAreas || []
      },
      partnerTraits: {
        name: partnerDemographics.name || undefined,
        loveLanguage: partnerProfile.loveLanguage || undefined,
        communicationStyle: partnerProfile.communicationStyle || undefined,
        conflictStyle: partnerProfile.conflictStyle || undefined,
        stressResponse: partnerProfile.stressResponse || undefined,
        attachmentStyle: partnerProfile.attachmentStyle || undefined,
        triggers: partnerProfile.triggers || [],
        strengths: partnerProfile.strengths || [],
        growthAreas: partnerProfile.growthAreas || []
      },
      dynamics: {
        loveLanguageMatch: yourProfile.loveLanguage === partnerProfile.loveLanguage,
        loveLanguageGap: yourProfile.loveLanguage !== partnerProfile.loveLanguage,
        communicationMatch: yourProfile.communicationStyle === partnerProfile.communicationStyle,
        conflictDynamic: yourProfile.conflictStyle && partnerProfile.conflictStyle ? 
          `${yourProfile.conflictStyle}-${partnerProfile.conflictStyle}` : undefined
      }
    };
  }

  static getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = []): string {
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';
    
    // Extract key elements from the user's specific message
    const messageAnalysis = this.analyzeUserMessage(userMessage);
    const conversationContext = this.getConversationContext(chatHistory);
    
    // Generate response based on what they actually said
    return this.generateContextualResponse(userMessage, messageAnalysis, context, conversationContext);
  }

  private static analyzeUserMessage(message: string) {
    const lowerMessage = message.toLowerCase();
    
    return {
      // Specific actions or events mentioned
      mentionsSpecificEvent: /yesterday|today|last night|this morning|earlier|just now/.test(lowerMessage),
      
      // Emotional indicators
      emotions: {
        frustrated: /frustrated|annoyed|irritated|mad|angry/.test(lowerMessage),
        hurt: /hurt|upset|sad|disappointed|crushed/.test(lowerMessage),
        confused: /confused|lost|don't understand|unclear/.test(lowerMessage),
        anxious: /anxious|worried|nervous|scared|afraid/.test(lowerMessage),
        hopeful: /better|hope|trying|want to fix|working on/.test(lowerMessage)
      },
      
      // Relationship dynamics mentioned
      dynamics: {
        communication: /talk|said|told|conversation|discuss|mention/.test(lowerMessage),
        conflict: /fight|argument|disagree|clash|tension/.test(lowerMessage),
        distance: /distant|space|pulling away|avoiding|cold/.test(lowerMessage),
        intimacy: /close|intimate|connect|affection|love|romance/.test(lowerMessage),
        support: /support|help|there for|care|comfort/.test(lowerMessage)
      },
      
      // Question types
      questionType: {
        howTo: /how do i|how can i|what should i|how to/.test(lowerMessage),
        whyIs: /why is|why does|why do/.test(lowerMessage),
        whatIf: /what if|what should|what would/.test(lowerMessage),
        isThis: /is this|am i|are we/.test(lowerMessage)
      },
      
      // Specific scenarios
      scenarios: {
        repeated: /again|same|keeps|always|every time/.test(lowerMessage),
        recent: /just|today|yesterday|last/.test(lowerMessage),
        ongoing: /always|constantly|never|forever/.test(lowerMessage)
      }
    };
  }

  private static getConversationContext(chatHistory: ChatMessage[]) {
    const recentMessages = chatHistory.slice(-4);
    const previousTopics = new Set();
    
    recentMessages.forEach(msg => {
      if (msg.type === 'user') {
        const analysis = this.analyzeUserMessage(msg.content);
        Object.keys(analysis.dynamics).forEach(dynamic => {
          if (analysis.dynamics[dynamic]) previousTopics.add(dynamic);
        });
      }
    });
    
    return {
      isFollowUp: recentMessages.length > 0,
      previousTopics: Array.from(previousTopics),
      lastUserMessage: recentMessages.filter(m => m.type === 'user').slice(-1)[0]?.content || ''
    };
  }

  private static generateContextualResponse(
    userMessage: string, 
    analysis: any, 
    context: PersonContext, 
    convContext: any
  ): string {
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';
    
    let response = '';
    
    // Start with acknowledgment of their specific situation
    if (analysis.mentionsSpecificEvent) {
      response += this.acknowledgeSpecificEvent(userMessage, analysis);
    } else if (convContext.isFollowUp) {
      response += this.acknowledgeFollowUp(userMessage, convContext);
    } else {
      response += this.acknowledgeNewTopic(userMessage, analysis);
    }
    
    response += '\n\n';
    
    // Address their specific emotional state
    if (Object.values(analysis.emotions).some(Boolean)) {
      response += this.addressEmotions(analysis.emotions, context);
      response += '\n\n';
    }
    
    // Provide specific insight based on what they're actually asking
    if (analysis.questionType.howTo) {
      response += this.provideHowToAdvice(userMessage, context, analysis);
    } else if (analysis.questionType.whyIs) {
      response += this.explainWhy(userMessage, context, analysis);
    } else if (analysis.questionType.whatIf || analysis.questionType.isThis) {
      response += this.validateAndGuide(userMessage, context, analysis);
    } else {
      response += this.reflectAndAdvise(userMessage, context, analysis);
    }
    
    response += '\n\n';
    
    // End with specific, actionable next step
    response += this.getSpecificNextStep(userMessage, context, analysis);
    
    return response;
  }

  private static acknowledgeSpecificEvent(message: string, analysis: any): string {
    const acknowledgments = [
      "Okay, so this just happened and it's fresh on your mind.",
      "Sounds like this is still pretty raw from when it happened.",
      "This is clearly still weighing on you from earlier."
    ];
    return acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
  }

  private static acknowledgeFollowUp(message: string, convContext: any): string {
    return "I can tell you're still processing what we talked about, and honestly, that makes sense.";
  }

  private static acknowledgeNewTopic(message: string, analysis: any): string {
    if (analysis.scenarios.ongoing) {
      return "This sounds like something that's been building up for a while, and you're finally ready to address it.";
    } else if (analysis.scenarios.repeated) {
      return "Ugh, the same pattern again? I can feel your frustration with this cycle.";
    } else {
      return "Alright, let's dig into what's really happening here.";
    }
  }

  private static addressEmotions(emotions: any, context: PersonContext): string {
    const responses = [];
    
    if (emotions.frustrated) {
      responses.push(`The frustration is totally valid - when you care this much about someone and feel stuck, it's maddening.`);
    }
    if (emotions.hurt) {
      responses.push(`That hurt you're feeling? It's real, and it matters. Don't minimize it.`);
    }
    if (emotions.confused) {
      responses.push(`Confusion in relationships is so disorienting because you want clarity but everything feels muddy.`);
    }
    if (emotions.anxious) {
      if (context.yourTraits.attachmentStyle === 'anxious') {
        responses.push(`Your anxious attachment is probably making this feel even more intense than it already is.`);
      } else {
        responses.push(`That anxiety is your brain trying to protect the relationship, even if it doesn't feel helpful right now.`);
      }
    }
    if (emotions.hopeful) {
      responses.push(`I love that you're approaching this with hope and intention to make things better.`);
    }
    
    return responses.length > 0 ? responses[0] : '';
  }

  private static provideHowToAdvice(message: string, context: PersonContext, analysis: any): string {
    // Extract what they're specifically asking how to do
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('talk to') || lowerMessage.includes('bring up')) {
      return this.getConversationAdvice(message, context);
    } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return this.getSupportAdvice(message, context);
    } else if (lowerMessage.includes('fix') || lowerMessage.includes('resolve')) {
      return this.getResolutionAdvice(message, context);
    } else {
      return `Here's the thing about your specific situation: ${this.getPersonalizedInsight(context, analysis)}`;
    }
  }

  private static explainWhy(message: string, context: PersonContext, analysis: any): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('keeps happening') || lowerMessage.includes('same')) {
      return `You're stuck in a pattern because both of you are responding from your default modes instead of stepping back and changing the dance. ${this.getPatternBreakingAdvice(context)}`;
    } else {
      return `There's usually something deeper going on. ${this.getDeepAnalysis(message, context)}`;
    }
  }

  private static validateAndGuide(message: string, context: PersonContext, analysis: any): string {
    return `Your instincts about this are probably right. ${this.getValidationAndGuidance(message, context)}`;
  }

  private static reflectAndAdvise(message: string, context: PersonContext, analysis: any): string {
    return `Let me reflect back what I'm hearing: ${this.getReflection(message, context)} ${this.getTargetedAdvice(message, context)}`;
  }

  private static getConversationAdvice(message: string, context: PersonContext): string {
    const theirStyle = context.partnerTraits.communicationStyle;
    
    if (theirStyle === 'avoidant') {
      return `Since ${context.partnerTraits.name || 'your partner'} tends to be more reserved, try: "I've been thinking about something and would love your perspective when you have bandwidth."`;
    } else if (theirStyle === 'direct') {
      return `They appreciate directness, so you can be straightforward: "I want to talk about [specific thing] because it matters to me."`;
    } else {
      return `Start with something like: "I care about us and there's something on my mind. When would be a good time to chat?"`;
    }
  }

  private static getSupportAdvice(message: string, context: PersonContext): string {
    const theirLoveLanguage = context.partnerTraits.loveLanguage;
    
    if (theirLoveLanguage === 'acts_of_service') {
      return `Look for the small things they normally handle and just quietly take care of one of them.`;
    } else if (theirLoveLanguage === 'words_of_affirmation') {
      return `Tell them something specific you appreciate about how they handle stress or challenges.`;
    } else {
      return `Ask them directly: "What would actually be helpful for you right now?" Then do that thing.`;
    }
  }

  private static getResolutionAdvice(message: string, context: PersonContext): string {
    return `Focus on one specific behavior or interaction, not trying to fix everything at once. What's the smallest change that would make the biggest difference?`;
  }

  private static getPersonalizedInsight(context: PersonContext, analysis: any): string {
    const insights = [
      `Given your ${context.yourTraits.communicationStyle || 'communication'} style and their ${context.partnerTraits.communicationStyle || 'different'} approach, you're probably speaking different languages right now.`,
      `Your relationship dynamic suggests this is more about timing and approach than the actual issue itself.`,
      `Based on what I know about both of you, there's likely a simple shift that could change everything.`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private static getPatternBreakingAdvice(context: PersonContext): string {
    return `Try doing the opposite of what you normally do. If you usually pursue, try giving space. If you usually withdraw, try engaging.`;
  }

  private static getDeepAnalysis(message: string, context: PersonContext): string {
    return `This might be less about the surface issue and more about feeling heard, valued, or secure in the relationship.`;
  }

  private static getValidationAndGuidance(message: string, context: PersonContext): string {
    return `Trust what you're picking up on, and let's figure out how to address it constructively.`;
  }

  private static getReflection(message: string, context: PersonContext): string {
    // This should actually reflect back what they said, not generic statements
    return `you're dealing with something that feels [reflect their actual words back] and you want to [reflect their goal/concern].`;
  }

  private static getTargetedAdvice(message: string, context: PersonContext): string {
    return `Here's what I think would help most in your specific situation: [specific advice based on their exact message].`;
  }

  private static getSpecificNextStep(message: string, context: PersonContext, analysis: any): string {
    const steps = [
      `Tonight, try this: ${this.getImmediateAction(message, context)}`,
      `Your next move: ${this.getImmediateAction(message, context)}`,
      `Here's what I'd do if I were you: ${this.getImmediateAction(message, context)}`
    ];
    
    return steps[Math.floor(Math.random() * steps.length)];
  }

  private static getImmediateAction(message: string, context: PersonContext): string {
    const lowerMessage = message.toLowerCase();
    const theirName = context.partnerTraits.name || 'your partner';
    
    if (lowerMessage.includes('talk') || lowerMessage.includes('conversation')) {
      return `Ask ${theirName}: "When's a good time for us to chat about something that's on my mind?"`;
    } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return `Do one small thing that makes their day easier without announcing it.`;
    } else if (lowerMessage.includes('fight') || lowerMessage.includes('argument')) {
      return `Next time you feel tension building, say: "I can feel us getting defensive. Can we start over?"`;
    } else {
      return `Send them a text about one specific thing you appreciated about them today.`;
    }
  }
}
