import { PersonContext, ChatMessage } from "@/types/AIInsights";
import { AIService } from "@/services/aiService";

export class AICoachEngine {
  private static aiService: AIService | null = null;

  static setAPIKey(apiKey: string) {
    this.aiService = new AIService({ apiKey });
    console.log('AI Service configured for Anthropic API only');
  }

  static buildPersonContext(profiles: any, demographicsData: any): PersonContext {
    console.log('Raw profiles data:', profiles);
    console.log('Raw demographics data:', demographicsData);
    
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemographics = demographicsData.your || {};
    const partnerDemographics = demographicsData.partner || {};

    console.log('Processed yourProfile:', yourProfile);
    console.log('Processed partnerProfile:', partnerProfile);
    console.log('Processed yourDemographics:', yourDemographics);
    console.log('Processed partnerDemographics:', partnerDemographics);

    const context = {
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

    console.log('Final context built:', context);
    return context;
  }

  static async getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = []): Promise<string> {
    console.log('Getting Anthropic AI response...');
    console.log('Context being used:', context);

    // Debug command
    if (userMessage.toUpperCase().includes("DEBUG PROFILES")) {
      return this.generateDebugResponse(context);
    }

    // Require API key - no fallbacks
    if (!this.aiService) {
      throw new Error(`🔑 **API Key Required**\n\nPlease add your Anthropic API key to use the AI coach.\n\nGet your key at: https://console.anthropic.com/account/keys`);
    }

    console.log('Making Anthropic API call...');
    try {
      const response = await this.generateRealAIResponse(userMessage, context, chatHistory);
      console.log('Anthropic AI response generated successfully');
      return response;
    } catch (error) {
      console.error('Anthropic API Error:', error);
      
      // Provide specific error messages based on the error type
      if (error.message.includes('Invalid API key')) {
        throw new Error(`🔑 **Invalid API Key**\n\n${error.message}\n\nPlease check your API key at: https://console.anthropic.com/account/keys`);
      }
      
      if (error.message.includes('Rate limit')) {
        throw new Error(`⏱️ **Rate Limit Exceeded**\n\n${error.message}\n\nPlease wait a moment before sending another message.`);
      }
      
      if (error.message.includes('CORS proxy access denied') || error.message.includes('corsdemo')) {
        throw new Error(`🚫 **CORS Proxy Unavailable**\n\nThe public CORS proxy services are currently restricting access. This is a temporary issue with the proxy services, not your API key.\n\n**What you can try:**\n1. Wait a few minutes and try again\n2. Refresh the page and try again\n3. The issue usually resolves itself within an hour\n\n**For a permanent solution:** Consider running this app through a backend server to avoid CORS limitations entirely.`);
      }
      
      if (error.message.includes('All connection methods failed')) {
        throw new Error(`🌐 **Connection Issue**\n\n${error.message}\n\nThis appears to be a temporary issue with multiple proxy services. Please try again in a few minutes.`);
      }
      
      if (error.message.includes('Network error')) {
        throw new Error(`🌐 **Connection Issue**\n\n${error.message}\n\nThis could be due to:\n1. Internet connectivity issues\n2. Proxy services being temporarily unavailable\n3. Anthropic service maintenance\n\nPlease try again in a moment.`);
      }
      
      // For any other API error, throw it
      throw new Error(`❌ **API Error**\n\n${error.message}\n\nIf this persists, please check the Anthropic service status.`);
    }
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

**AI Service Status:** ${this.aiService ? "Connected - Anthropic API Only" : "Not connected"}

If any of this is wrong or missing, there's a profile access issue.`;
  }
}
