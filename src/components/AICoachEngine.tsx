
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
    const message = userMessage.toLowerCase();
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';
    
    // Analyze conversation history for context
    const conversationContext = this.analyzeConversationHistory(chatHistory, userMessage);
    
    // Generate dynamic response based on message content and context
    return this.generateDynamicResponse(userMessage, context, conversationContext);
  }

  private static analyzeConversationHistory(chatHistory: ChatMessage[], currentMessage: string) {
    const recentMessages = chatHistory.slice(-6); // Last 3 exchanges
    const topics = new Set<string>();
    const emotions = new Set<string>();
    const isFollowUp = recentMessages.length > 0;
    
    // Extract themes from recent conversation
    recentMessages.forEach(msg => {
      const content = msg.content.toLowerCase();
      
      // Detect topics
      if (content.includes('communication') || content.includes('talk')) topics.add('communication');
      if (content.includes('fight') || content.includes('argument')) topics.add('conflict');
      if (content.includes('support') || content.includes('help')) topics.add('support');
      if (content.includes('anxious') || content.includes('worry')) topics.add('anxiety');
      if (content.includes('love') || content.includes('affection')) topics.add('love');
      if (content.includes('space') || content.includes('distance')) topics.add('distance');
      
      // Detect emotional tone
      if (content.includes('frustrated') || content.includes('angry')) emotions.add('frustrated');
      if (content.includes('sad') || content.includes('hurt')) emotions.add('hurt');
      if (content.includes('confused') || content.includes('lost')) emotions.add('confused');
      if (content.includes('hopeful') || content.includes('better')) emotions.add('hopeful');
    });

    return {
      isFollowUp,
      recentTopics: Array.from(topics),
      recentEmotions: Array.from(emotions),
      conversationDepth: recentMessages.length
    };
  }

  private static generateDynamicResponse(userMessage: string, context: PersonContext, convContext: any): string {
    const message = userMessage.toLowerCase();
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';
    
    // Generate varied conversation starters
    const dynamicOpenings = this.getDynamicOpening(message, context, convContext);
    
    // Main response logic with much more variety
    if (this.isAboutCommunication(message)) {
      return this.generateCommunicationResponse(userMessage, context, convContext, dynamicOpenings);
    }
    
    if (this.isAboutConflict(message)) {
      return this.generateConflictResponse(userMessage, context, convContext, dynamicOpenings);
    }
    
    if (this.isAboutSupport(message)) {
      return this.generateSupportResponse(userMessage, context, convContext, dynamicOpenings);
    }
    
    if (this.isAboutAnxiety(message)) {
      return this.generateAnxietyResponse(userMessage, context, convContext, dynamicOpenings);
    }
    
    if (this.isAboutIntimacy(message)) {
      return this.generateIntimacyResponse(userMessage, context, convContext, dynamicOpenings);
    }
    
    // Default response with high variety
    return this.generateOpenEndedResponse(userMessage, context, convContext, dynamicOpenings);
  }

  private static getDynamicOpening(message: string, context: PersonContext, convContext: any): string {
    const openings = [];
    
    if (convContext.isFollowUp) {
      openings.push(
        "I've been thinking about what you shared...",
        "Building on what we talked about...",
        "So this is still on your mind, huh?",
        "Okay, let's dig deeper into this...",
        "I hear you - this is really weighing on you."
      );
    } else {
      openings.push(
        "Alright, let's talk about this.",
        "I can feel the weight of this in your message.",
        "Okay, I want to really understand what's happening here.",
        "This sounds like it's been building up for a while.",
        "I can tell this matters a lot to you."
      );
    }
    
    if (convContext.recentEmotions.includes('frustrated')) {
      openings.push(
        "I can sense the frustration here, and honestly? That makes complete sense.",
        "Yeah, this would be driving me up the wall too."
      );
    }
    
    return openings[Math.floor(Math.random() * openings.length)];
  }

  private static generateCommunicationResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    const youName = context.yourTraits.name || 'you';
    const theirName = context.partnerTraits.name || 'your partner';
    
    const communicationStyles = {
      direct: "straight-forward, no-bullshit conversations",
      gentle: "softer, more feeling-focused talks",
      analytical: "logical, step-by-step discussions"
    };
    
    const yourStyle = context.yourTraits.communicationStyle || 'direct';
    const theirStyle = context.partnerTraits.communicationStyle || 'gentle';
    
    let response = `${opening}\n\n`;
    
    if (convContext.isFollowUp && convContext.recentTopics.includes('communication')) {
      response += `So we've been working on the communication thing, and it sounds like you're still hitting some walls. `;
    }
    
    response += `Here's what I'm noticing: you tend to go for ${communicationStyles[yourStyle] || 'your usual approach'}, `;
    response += `while ${theirName} is more about ${communicationStyles[theirStyle] || 'their own style'}. `;
    
    if (yourStyle !== theirStyle) {
      response += `That's not wrong - it's just different languages, and right now you're both speaking your native tongue instead of learning each other's.\n\n`;
    } else {
      response += `You're actually pretty aligned in style, which is great - this might be more about timing or emotional state than approach.\n\n`;
    }
    
    // Specific advice based on their exact situation
    const specificAdvice = this.getSpecificCommunicationAdvice(userMessage, context);
    response += specificAdvice;
    
    response += `\n\nTry this tonight: ${this.getActionableStep(context, 'communication')}`;
    
    return response;
  }

  private static generateConflictResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    const conflictPatterns = {
      'confrontational-avoidant': "You want to hash it out, they want to retreat. Classic chase-withdraw dance.",
      'avoidant-confrontational': "They want to talk now, you need time to process. Pressure meets withdrawal.",
      'confrontational-confrontational': "You're both coming in hot, trying to be heard at the same time.",
      'avoidant-avoidant': "You're both dancing around the issue instead of addressing it directly."
    };
    
    const pattern = context.dynamics.conflictDynamic || 'mixed';
    
    let response = `${opening}\n\n`;
    
    if (userMessage.includes('same') || userMessage.includes('again')) {
      response += `Ugh, the same fight again? I get it. Nothing makes you feel more helpless than being stuck in that loop where you both know exactly how this is going to go.\n\n`;
    }
    
    if (conflictPatterns[pattern]) {
      response += `${conflictPatterns[pattern]} `;
    }
    
    response += `The thing is, underneath this surface-level stuff, there's usually something else going on. `;
    
    // Personalized based on attachment styles
    if (context.yourTraits.attachmentStyle === 'anxious') {
      response += `And I know with your anxious attachment, conflict probably feels like a threat to the whole relationship, right? Like every fight could be "the one" that ends everything.`;
    } else if (context.yourTraits.attachmentStyle === 'avoidant') {
      response += `With your avoidant tendencies, conflict probably feels overwhelming and you just want space to think, but that can feel like rejection to ${context.partnerTraits.name || 'your partner'}.`;
    }
    
    response += `\n\nWhat if, next time you feel this building, you tried: "${this.getPersonalizedConflictScript(context)}"`;
    
    return response;
  }

  private static generateSupportResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    const theirName = context.partnerTraits.name || 'your partner';
    
    let response = `${opening}\n\n`;
    
    if (userMessage.includes('don\'t know how') || userMessage.includes('not sure')) {
      response += `First off - the fact that you're asking this question already shows you care deeply. Most people just assume they know how to support their partner, but you're actually thinking about what THEY need, not just what feels natural to you.\n\n`;
    }
    
    // Highly specific based on love languages
    if (context.partnerTraits.loveLanguage) {
      response += `Since ${theirName}'s love language is ${context.partnerTraits.loveLanguage}, `;
      
      switch (context.partnerTraits.loveLanguage) {
        case 'acts_of_service':
          response += `support for them looks like handling stuff they normally worry about. Not grand gestures - just noticing what's on their mental load and quietly taking care of it.`;
          break;
        case 'words_of_affirmation':
          response += `they need to hear specifically what you appreciate about them. Not just "you're great" but "I love how you always remember to text me when you get home safe."`;
          break;
        case 'quality_time':
          response += `being fully present with them - phone away, distractions off - matters more than doing anything fancy together.`;
          break;
        case 'physical_touch':
          response += `physical connection is how they feel most supported. Even just holding their hand while they vent can be huge.`;
          break;
        case 'receiving_gifts':
          response += `thoughtful little things that show you were thinking of them. Not expensive stuff - just "saw this and thought of you" moments.`;
          break;
      }
    } else {
      response += `since I don't know their love language yet, pay attention to how they naturally show love to you - that's probably how they want to receive it too.`;
    }
    
    response += `\n\n**Right now, try this:** ${this.getImmediateAction(context, userMessage)}`;
    
    return response;
  }

  private static generateAnxietyResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    let response = `${opening}\n\n`;
    
    if (context.yourTraits.attachmentStyle === 'anxious') {
      response += `Okay, so your anxious attachment is doing that thing where it turns every small worry into "OH GOD WHAT IF EVERYTHING IS FALLING APART." I see you, and this makes total sense given how your brain is wired.\n\n`;
    }
    
    if (userMessage.includes('overthinking') || userMessage.includes('spiraling')) {
      response += `The overthinking spiral is real, and it's exhausting. Your brain is trying to solve problems that might not even exist, but it FEELS so real when you're in it.\n\n`;
    }
    
    response += `Let's reality-check this: `;
    
    // Personalized reality check based on their specific situation
    if (context.partnerTraits.communicationStyle === 'avoidant') {
      response += `${context.partnerTraits.name || 'Your partner'} tends to need processing time, which your anxious brain probably interprets as withdrawal or rejection. But for them, space isn't rejection - it's how they show up better.`;
    } else {
      response += `what specific thing happened that triggered this feeling? Not the story your anxiety is telling you, but what actually occurred?`;
    }
    
    response += `\n\n**Try this right now:** ${this.getAnxietyTechnique(context, userMessage)}`;
    
    return response;
  }

  private static generateIntimacyResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    let response = `${opening}\n\n`;
    
    response += `Intimacy stuff is vulnerable as hell to talk about, so I'm glad you brought this up. `;
    
    if (userMessage.includes('disconnect') || userMessage.includes('distant')) {
      response += `Feeling disconnected from your partner is one of the loneliest feelings in the world, especially when you're literally sharing a life with them.\n\n`;
    }
    
    // Different approaches based on love languages and communication styles
    const approachAdvice = this.getIntimacyAdvice(context, userMessage);
    response += approachAdvice;
    
    return response;
  }

  private static generateOpenEndedResponse(userMessage: string, context: PersonContext, convContext: any, opening: string): string {
    const theirName = context.partnerTraits.name || 'your partner';
    
    let response = `${opening}\n\n`;
    
    response += `I can tell this is weighing on you, and the fact that you're here working on your relationship says everything about who you are as a partner.\n\n`;
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      const randomStrength = context.yourTraits.strengths[Math.floor(Math.random() * context.yourTraits.strengths.length)];
      response += `I know you bring ${randomStrength} to this relationship, and that's not nothing. `;
    }
    
    response += `Help me understand what's really going on here. What's the thing that's keeping you up at night or making you feel stuck?\n\n`;
    
    response += `The more specific you can be about what's actually happening (not just how you feel about it), the better I can help you figure out your next move.`;
    
    return response;
  }

  // Helper methods for generating specific advice
  private static isAboutCommunication(message: string): boolean {
    return message.includes('talk') || message.includes('communication') || message.includes('conversation') || message.includes('discuss');
  }

  private static isAboutConflict(message: string): boolean {
    return message.includes('fight') || message.includes('argument') || message.includes('conflict') || message.includes('disagree');
  }

  private static isAboutSupport(message: string): boolean {
    return message.includes('support') || message.includes('help') || message.includes('there for');
  }

  private static isAboutAnxiety(message: string): boolean {
    return message.includes('anxious') || message.includes('worry') || message.includes('stress') || message.includes('overthink');
  }

  private static isAboutIntimacy(message: string): boolean {
    return message.includes('intimacy') || message.includes('disconnect') || message.includes('distant') || message.includes('close');
  }

  private static getSpecificCommunicationAdvice(userMessage: string, context: PersonContext): string {
    // Generate specific advice based on the exact message content and context
    const adviceOptions = [
      `Instead of "we need to talk" (which sends everyone into fight-or-flight), try "I've been thinking about something and would love your perspective when you have a few minutes."`,
      `Ask them when they're most receptive to important conversations. Some people are morning people, some need to decompress after work first.`,
      `Try the 24-hour rule: when something bothers you, sit with it for a day. If it still matters, bring it up. If not, let it go.`
    ];
    
    return adviceOptions[Math.floor(Math.random() * adviceOptions.length)];
  }

  private static getPersonalizedConflictScript(context: PersonContext): string {
    const scripts = [
      `"I can feel us getting into that pattern again. Can we take a step back and figure out what we both actually need here?"`,
      `"I'm feeling [emotion] about [specific thing], and I want to understand how you're experiencing this too."`,
      `"Let's pause this for 20 minutes and come back when we're both a little calmer."`
    ];
    
    return scripts[Math.floor(Math.random() * scripts.length)];
  }

  private static getActionableStep(context: PersonContext, topic: string): string {
    const steps = {
      communication: [
        `Ask ${context.partnerTraits.name || 'them'} what time of day they feel most ready for important conversations.`,
        `Share one specific thing you appreciated about them today, not just "thanks for being you."`,
        `Try having a 10-minute check-in about how you're both feeling, no problem-solving allowed.`
      ]
    };
    
    const topicSteps = steps[topic] || steps.communication;
    return topicSteps[Math.floor(Math.random() * topicSteps.length)];
  }

  private static getImmediateAction(context: PersonContext, userMessage: string): string {
    const actions = [
      `Text them something specific you appreciate about them right now.`,
      `Ask them directly: "What would make your day easier?" Then do that thing.`,
      `Notice one small stress in their life and quietly handle it without announcing it.`
    ];
    
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private static getAnxietyTechnique(context: PersonContext, userMessage: string): string {
    const techniques = [
      `Write down exactly what you're worried about, then ask yourself: "Is this based on what actually happened, or what I'm afraid might happen?"`,
      `Text ${context.partnerTraits.name || 'your partner'} one specific thing you need right now. Not "I'm anxious about us," but "I'd love to spend 20 minutes together tonight."`,
      `Set a timer for 10 minutes and let yourself fully spiral. When it goes off, you're done catastrophizing for today.`
    ];
    
    return techniques[Math.floor(Math.random() * techniques.length)];
  }

  private static getIntimacyAdvice(context: PersonContext, userMessage: string): string {
    const advice = [
      `Start small: instead of trying to fix all the connection stuff at once, focus on one tiny moment of real presence together each day.`,
      `Ask them: "What makes you feel most connected to me?" Their answer might surprise you.`,
      `Create a weekly 15-minute check-in where you both share one thing you're excited about and one thing you're worried about. No advice, just listening.`
    ];
    
    return advice[Math.floor(Math.random() * advice.length)];
  }
}
