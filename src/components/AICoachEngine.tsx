import { PersonContext, ChatMessage } from "@/types/AIInsights";
import { AIService } from "@/services/aiService";

export class AICoachEngine {
  private static aiService: AIService | null = null;

  static setAPIKey(apiKey: string) {
    this.aiService = new AIService({ apiKey });
    console.log('AI Service configured with API key');
  }

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

  static async getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = []): Promise<string> {
    console.log('Getting AI response...');
    console.log('AI Service available:', !!this.aiService);
    console.log('User message:', userMessage);

    // Debug command
    if (userMessage.toUpperCase().includes("DEBUG PROFILES")) {
      return this.generateDebugResponse(context);
    }

    // If API key is available, ALWAYS use the API - no fallbacks
    if (this.aiService) {
      console.log('AI service is available, attempting real AI response...');
      try {
        const response = await this.generateRealAIResponse(userMessage, context, chatHistory);
        console.log('Real AI response generated successfully');
        return response;
      } catch (error) {
        console.error('AI API Error:', error);
        
        // Check if it's a CORS error
        if (error.message.includes('CORS_ERROR')) {
          throw new Error(`🔒 **Browser Security Issue**\n\nYour browser is blocking direct API calls to Anthropic due to CORS policies. This is a common browser security limitation.\n\n**Solutions:**\n1. Use a CORS proxy service\n2. Run this app through a backend server\n3. Use a browser extension that disables CORS (not recommended for security)\n\nThe API key is valid, but your browser environment doesn't allow direct API calls.`);
        }
        
        // For any other API error, throw it instead of falling back
        throw new Error(`❌ **API Error**\n\n${error.message}\n\nPlease check your API key and try again. If the problem persists, there may be an issue with the Anthropic service.`);
      }
    }

    // If no API key is set, require it
    throw new Error(`🔑 **API Key Required**\n\nNo API key has been configured. Please add your Anthropic API key to use the AI coach.\n\nGet your key at: https://console.anthropic.com/account/keys`);
  }

  private static async generateRealAIResponse(
    userMessage: string, 
    context: PersonContext, 
    chatHistory: ChatMessage[]
  ): Promise<string> {
    console.log('Building system prompt...');
    const systemPrompt = this.buildSystemPrompt(context);
    console.log('System prompt built, length:', systemPrompt.length);

    const conversationHistory = chatHistory.slice(-6).map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    console.log('Conversation history prepared, length:', conversationHistory.length);
    console.log('Making API call to Anthropic...');

    const response = await this.aiService!.generateResponse(userMessage, systemPrompt, conversationHistory);
    console.log('API response received, length:', response.length);
    return response;
  }

  private static buildSystemPrompt(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";

    return `You are a relationship coach specializing in millennial relationships. You provide personalized advice based on detailed profiles.

CRITICAL: You MUST reference specific details from both user and partner profiles in EVERY response.

USER PROFILE - ${userName}:
- Communication style: ${context.yourTraits.communicationStyle || "Unknown"}
- Attachment style: ${context.yourTraits.attachmentStyle || "Unknown"}
- Conflict style: ${context.yourTraits.conflictStyle || "Unknown"}
- Love language: ${context.yourTraits.loveLanguage || "Unknown"}
- Stress response: ${context.yourTraits.stressResponse || "Unknown"}
- Triggers: ${context.yourTraits.triggers?.join(", ") || "None listed"}
- Strengths: ${context.yourTraits.strengths?.join(", ") || "None listed"}

PARTNER PROFILE - ${partnerName}:
- Communication style: ${context.partnerTraits.communicationStyle || "Unknown"}
- Attachment style: ${context.partnerTraits.attachmentStyle || "Unknown"}
- Conflict style: ${context.partnerTraits.conflictStyle || "Unknown"}
- Love language: ${context.partnerTraits.loveLanguage || "Unknown"}
- Stress response: ${context.partnerTraits.stressResponse || "Unknown"}
- Triggers: ${context.partnerTraits.triggers?.join(", ") || "None listed"}
- Strengths: ${context.partnerTraits.strengths?.join(", ") || "None listed"}

RELATIONSHIP CONTEXT:
- Length: ${context.relationship.length || "Unknown"}
- Living together: ${context.relationship.livingTogether ? "Yes" : "No"}
- Stage: ${context.relationship.stage || "Unknown"}

RESPONSE REQUIREMENTS:
1. Use both partners' actual names naturally throughout
2. Reference their specific communication and attachment styles
3. Connect advice to their known triggers and patterns
4. Make advice specific to their dynamic, not generic
5. Sound like you've known them for years
6. Keep responses conversational and supportive
7. Provide actionable, tailored strategies

Never give generic relationship advice. Every response must be personalized to ${userName} and ${partnerName}'s specific situation.`;
  }

  private static generateDebugResponse(context: PersonContext): string {
    const userName = context.yourTraits.name || "Unknown";
    const partnerName = context.partnerTraits.name || "Unknown";

    return `DEBUG - Here's what I can see:

**About ${userName}:**
- Communication style: ${context.yourTraits.communicationStyle || "Not specified"}
- Attachment style: ${context.yourTraits.attachmentStyle || "Not specified"}
- Conflict style: ${context.yourTraits.conflictStyle || "Not specified"}
- Love language: ${context.yourTraits.loveLanguage || "Not specified"}
- Triggers: ${context.yourTraits.triggers?.join(", ") || "None listed"}

**About ${partnerName}:**
- Communication style: ${context.partnerTraits.communicationStyle || "Not specified"}
- Attachment style: ${context.partnerTraits.attachmentStyle || "Not specified"}
- Conflict style: ${context.partnerTraits.conflictStyle || "Not specified"}
- Love language: ${context.partnerTraits.loveLanguage || "Not specified"}
- Triggers: ${context.partnerTraits.triggers?.join(", ") || "None listed"}

**AI Service Status:** ${this.aiService ? "Connected - API ONLY MODE" : "Not connected"}

If any of this is wrong or missing, there's a profile access issue.`;
  }

  private static generatePersonalizedResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[]): string {
    const userName = context.yourTraits.name!;
    const partnerName = context.partnerTraits.name!;
    
    // Analyze the user's message
    const messageAnalysis = this.analyzeUserMessage(userMessage);
    const conversationContext = this.getConversationContext(chatHistory);
    
    // Build personalized response using the template
    let response = "";
    
    // 1. Personal Validation
    response += this.generatePersonalValidation(messageAnalysis, context);
    response += "\n\n";
    
    // 2. Pattern Recognition
    response += this.generatePatternRecognition(messageAnalysis, context);
    response += "\n\n";
    
    // 3. Psychological Insight
    response += this.generatePsychologicalInsight(messageAnalysis, context);
    response += "\n\n";
    
    // 4. Tailored Strategy
    response += this.generateTailoredStrategy(userMessage, messageAnalysis, context);
    response += "\n\n";
    
    // 5. Next Steps
    response += this.generateNextSteps(userMessage, messageAnalysis, context);
    
    return response;
  }

  private static analyzeUserMessage(message: string) {
    const lowerMessage = message.toLowerCase();
    
    return {
      topic: {
        communication: /talk|conversation|discuss|said|told/.test(lowerMessage),
        conflict: /fight|argument|disagree|angry|mad/.test(lowerMessage),
        intimacy: /close|distant|affection|love|romance/.test(lowerMessage),
        support: /support|help|there for|care/.test(lowerMessage),
        money: /money|spending|budget|financial/.test(lowerMessage),
        time: /time|schedule|busy|priorities/.test(lowerMessage),
        family: /family|parents|kids|children/.test(lowerMessage)
      },
      emotion: {
        frustrated: /frustrated|annoyed|irritated/.test(lowerMessage),
        hurt: /hurt|upset|sad|disappointed/.test(lowerMessage),
        confused: /confused|lost|unclear/.test(lowerMessage),
        anxious: /anxious|worried|nervous|scared/.test(lowerMessage),
        defensive: /defensive|attack|blame/.test(lowerMessage)
      },
      timing: {
        recent: /yesterday|today|last night|this morning|just/.test(lowerMessage),
        ongoing: /always|never|constantly|keeps/.test(lowerMessage),
        future: /should|will|going to|plan/.test(lowerMessage)
      }
    };
  }

  private static getConversationContext(chatHistory: ChatMessage[]) {
    return {
      previousMessages: chatHistory.slice(-3),
      isFollowUp: chatHistory.length > 0
    };
  }

  private static generatePersonalValidation(analysis: any, context: PersonContext): string {
    const userName = context.yourTraits.name!;
    const userAttachment = context.yourTraits.attachmentStyle;
    
    if (analysis.emotion.frustrated) {
      if (userAttachment === "anxious") {
        return `I can see why this is so frustrating for you, ${userName}, especially with your anxious attachment style - when things feel uncertain or disconnected, it hits differently for you than it might for others.`;
      }
      return `I can see why this is frustrating for you, ${userName}. When you care this much about making things work, feeling stuck is maddening.`;
    }
    
    if (analysis.emotion.hurt) {
      return `That hurt you're feeling is completely valid, ${userName}. Don't minimize it - when someone matters this much to you, these moments cut deep.`;
    }
    
    if (analysis.emotion.confused) {
      return `${userName}, that confusion makes total sense. When you're trying to figure out relationship dynamics, especially with everything else going on, it's like trying to solve a puzzle with missing pieces.`;
    }
    
    return `I hear you, ${userName}. This is clearly weighing on you, and that makes sense given how much you care about this relationship.`;
  }

  private static generatePatternRecognition(analysis: any, context: PersonContext): string {
    const userName = context.yourTraits.name!;
    const partnerName = context.partnerTraits.name!;
    const userComm = context.yourTraits.communicationStyle;
    const partnerComm = context.partnerTraits.communicationStyle;
    
    if (analysis.topic.conflict && userComm && partnerComm) {
      return `This sounds like the classic dynamic where you (${userComm} communication style) and ${partnerName} (${partnerComm} style) are basically speaking different languages when stress hits.`;
    }
    
    if (analysis.topic.communication) {
      return `Based on what I know about how you and ${partnerName} typically navigate conversations, this feels like one of those moments where your different approaches are creating friction instead of connection.`;
    }
    
    return `This fits the pattern I see with you and ${partnerName} - you both care deeply but are approaching this from your own default modes.`;
  }

  private static generatePsychologicalInsight(analysis: any, context: PersonContext): string {
    const partnerName = context.partnerTraits.name!;
    const userAttachment = context.yourTraits.attachmentStyle;
    const partnerAttachment = context.partnerTraits.attachmentStyle;
    
    if (userAttachment && partnerAttachment) {
      if (userAttachment === "anxious" && partnerAttachment === "avoidant") {
        return `Here's what's happening psychologically: Your anxious attachment is seeking connection and reassurance, while ${partnerName}'s avoidant style is creating space when they feel pressured. You're both trying to feel safe, just in opposite ways.`;
      }
      
      if (userAttachment === "secure" && partnerAttachment === "anxious") {
        return `Based on your secure attachment and ${partnerName}'s anxious style, they might be reading into things that aren't there while you're operating from a place of natural stability. The gap is in emotional intensity, not actual care.`;
      }
    }
    
    if (analysis.emotion.defensive) {
      return `When ${partnerName} gets defensive, it's usually because they feel criticized or misunderstood, not because they don't care. Their ${context.partnerTraits.conflictStyle || "defensive"} response is protection, not rejection.`;
    }
    
    return `What's happening underneath is that you both want the same thing - to feel valued and understood - but your approaches are creating distance instead of connection.`;
  }

  private static generateTailoredStrategy(userMessage: string, analysis: any, context: PersonContext): string {
    const partnerName = context.partnerTraits.name!;
    const partnerComm = context.partnerTraits.communicationStyle;
    const partnerLove = context.partnerTraits.loveLanguage;
    
    if (analysis.topic.conflict && partnerComm) {
      if (partnerComm === "avoidant") {
        return `Given ${partnerName}'s avoidant communication style, try this approach: Give them space to process first, then come back with something like "I want to understand your perspective on this" rather than diving straight into solutions.`;
      }
      
      if (partnerComm === "direct") {
        return `Since ${partnerName} appreciates direct communication, be straightforward: "I'm feeling [specific emotion] about [specific situation]. Can we talk through this together?"`;
      }
    }
    
    if (analysis.topic.support && partnerLove) {
      if (partnerLove === "acts_of_service") {
        return `Knowing ${partnerName}'s love language is acts of service, look for something they usually handle and quietly take care of it. Don't announce it - just do it.`;
      }
      
      if (partnerLove === "words_of_affirmation") {
        return `Since ${partnerName} receives love through words of affirmation, tell them something specific you noticed and appreciated about them recently. Be concrete, not generic.`;
      }
    }
    
    return `Given what I know about ${partnerName}'s patterns, try approaching this from a place of curiosity rather than frustration. Ask questions to understand their perspective before sharing your own.`;
  }

  private static generateNextSteps(userMessage: string, analysis: any, context: PersonContext): string {
    const partnerName = context.partnerTraits.name!;
    const lowerMessage = userMessage.toLowerCase();
    
    if (analysis.topic.conflict) {
      return `Your next move: Text ${partnerName} something like "I care about us and I want to understand what happened from your perspective. When's a good time to talk?" Then actually listen to their answer.`;
    }
    
    if (analysis.topic.communication) {
      return `Tonight, try this: Ask ${partnerName} "What's one thing I could do differently to make you feel more heard?" Then do that thing, even if it feels small.`;
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return `Here's what I'd do if I were you: Ask ${partnerName} directly "What would actually be helpful for you right now?" and then follow through on whatever they say.`;
    }
    
    return `Your immediate next step: Have a conversation with ${partnerName} about this specific situation, not relationship issues in general. Start with "I want to understand..." and mean it.`;
  }
}
