import { PersonContext, ChatMessage } from "@/types/AIInsights";
import { AIService } from "@/services/aiService";

export class AICoachEngine {
  private static aiService: AIService | null = null;

  static setSupabaseConfig(supabaseUrl: string, supabaseAnonKey: string) {
    this.aiService = new AIService({ supabaseUrl, supabaseAnonKey });
    console.log('AI Service configured for Supabase backend');
  }

  static initializeSupabase() {
    const supabaseUrl = "https://relqmhrzyqckoaebscgx.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE";
    
    console.log('Using hardcoded Supabase configuration');
    
    this.setSupabaseConfig(supabaseUrl, supabaseAnonKey);
    return true;
  }

  static buildPersonContext(profiles: any, demographicsData: any): PersonContext {
    console.log('=== AICoachEngine.buildPersonContext ===');
    console.log('Input profiles:', profiles);
    console.log('Input demographicsData:', demographicsData);
    
    const yourProfile = profiles?.your?.[0] || {};
    const partnerProfile = profiles?.partner?.[0] || {};
    const yourDemographics = demographicsData?.your || {};
    const partnerDemographics = demographicsData?.partner || {};

    console.log('=== Extracted Data ===');
    console.log('yourProfile:', yourProfile);
    console.log('partnerProfile:', partnerProfile);
    console.log('yourDemographics:', yourDemographics);
    console.log('partnerDemographics:', partnerDemographics);

    const extractArrayValue = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    };

    const extractSingleValue = (value: any): string | undefined => {
      if (Array.isArray(value)) return value[0];
      if (typeof value === 'string') return value;
      return undefined;
    };

    const context: PersonContext = {
      relationship: {
        length: yourProfile.relationshipLength || yourDemographics.relationshipLength || undefined,
        livingTogether: yourDemographics.livingTogether || yourProfile.livingTogether || false,
        stage: yourProfile.relationshipStatus || yourDemographics.relationshipStatus || undefined
      },
      yourTraits: {
        name: yourDemographics.name || yourProfile.name || undefined,
        age: yourDemographics.age || yourProfile.age || undefined,
        pronouns: yourDemographics.pronouns || yourProfile.pronouns || undefined,
        loveLanguages: extractArrayValue(yourProfile.loveLanguages || yourDemographics.loveLanguages || yourProfile.feelLovedWhen),
        communicationStyle: extractSingleValue(yourProfile.communicationStyle || yourDemographics.communicationStyle),
        conflictStyle: extractSingleValue(yourProfile.conflictStyle || yourDemographics.conflictStyle),
        stressResponse: extractArrayValue(yourProfile.stressResponse || yourDemographics.stressResponse),
        attachmentStyle: extractSingleValue(yourProfile.attachmentStyle || yourDemographics.attachmentStyle),
        triggers: extractArrayValue(yourProfile.triggers || yourDemographics.triggers || yourProfile.feelsDifficult),
        strengths: extractArrayValue(yourProfile.strengths || yourDemographics.strengths || yourProfile.workingWell),
        growthAreas: extractArrayValue(yourProfile.growthAreas || yourDemographics.growthAreas || yourProfile.biggestChallenge),
        familyDynamics: extractArrayValue(yourProfile.familyDynamics || yourDemographics.familyDynamics),
        whyRealTalk: extractArrayValue(yourProfile.whyRealTalk || yourDemographics.whyRealTalk),
        mentalHealthContext: yourProfile.mentalHealthContext || yourDemographics.mentalHealthContext,
        education: yourProfile.education || yourDemographics.education,
        workSituation: yourProfile.workSituation || yourDemographics.workSituation,
        sexualOrientation: extractArrayValue(yourProfile.sexualOrientation || yourDemographics.sexualOrientation || yourProfile.orientation),
        genderIdentity: extractArrayValue(yourProfile.genderIdentity || yourDemographics.genderIdentity || yourProfile.gender)
      },
      partnerTraits: {
        name: partnerDemographics.name || partnerProfile.name || undefined,
        loveLanguages: extractArrayValue(partnerProfile.loveLanguages || partnerDemographics.loveLanguages),
        communicationStyle: extractSingleValue(partnerProfile.communicationStyle || partnerDemographics.communicationStyle),
        conflictStyle: extractSingleValue(partnerProfile.conflictStyle || partnerDemographics.conflictStyle),
        stressResponse: extractArrayValue(partnerProfile.stressResponse || partnerDemographics.stressResponse),
        attachmentStyle: extractSingleValue(partnerProfile.attachmentStyle || partnerDemographics.attachmentStyle),
        triggers: extractArrayValue(partnerProfile.triggers || partnerDemographics.triggers),
        strengths: extractArrayValue(partnerProfile.strengths || partnerDemographics.strengths),
        growthAreas: extractArrayValue(partnerProfile.growthAreas || partnerDemographics.growthAreas)
      },
      dynamics: {
        loveLanguageMatch: false,
        loveLanguageGap: false,
        communicationMatch: false,
        conflictDynamic: undefined
      }
    };

    // Calculate dynamics
    const yourLoveLanguages = context.yourTraits.loveLanguages || [];
    const partnerLoveLanguages = context.partnerTraits.loveLanguages || [];
    
    if (yourLoveLanguages.length > 0 && partnerLoveLanguages.length > 0) {
      const hasCommonLoveLanguage = yourLoveLanguages.some(lang => partnerLoveLanguages.includes(lang));
      context.dynamics.loveLanguageMatch = hasCommonLoveLanguage;
      context.dynamics.loveLanguageGap = !hasCommonLoveLanguage;
    }

    if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
      context.dynamics.communicationMatch = context.yourTraits.communicationStyle === context.partnerTraits.communicationStyle;
    }

    if (context.yourTraits.conflictStyle && context.partnerTraits.conflictStyle) {
      context.dynamics.conflictDynamic = `${context.yourTraits.conflictStyle}-${context.partnerTraits.conflictStyle}`;
    }

    console.log('=== Final Context Built ===');
    console.log('context:', context);
    console.log('Has user name:', !!context.yourTraits.name);
    console.log('Has user data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length);
    
    return context;
  }

  static async getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = [], enhancedPrompt?: string): Promise<string> {
    console.log('=== Getting AI Response ===');
    console.log('User message:', userMessage);
    console.log('Context being used:', context);
    console.log('User name from context:', context.yourTraits.name);
    console.log('User has profile data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length > 1);

    // Debug command - check for various forms of debug request
    if (userMessage.toLowerCase().includes("debug") && userMessage.toLowerCase().includes("profile")) {
      return this.generateDebugResponse(context);
    }

    // Initialize Supabase if not already configured
    if (!this.aiService) {
      const configured = this.initializeSupabase();
      if (!configured) {
        throw new Error(`🔧 **Backend Configuration Required**\n\nSupabase integration is not properly configured. Please:\n\n1. Ensure you're connected to Supabase via the green button in the top right\n2. Check that your Supabase project is active\n3. Verify the integration is working\n\nIf the issue persists, try refreshing the page.`);
      }
    }

    console.log('Making Supabase Edge Function call...');
    try {
      const response = await this.generateRealAIResponse(userMessage, context, chatHistory, enhancedPrompt);
      console.log('AI response generated successfully via Supabase');
      return response;
    } catch (error) {
      console.error('Supabase AI Error:', error);
      throw error;
    }
  }

  private static async generateRealAIResponse(
    userMessage: string, 
    context: PersonContext, 
    chatHistory: ChatMessage[],
    enhancedPrompt?: string
  ): Promise<string> {
    console.log('Building system prompt...');
    const systemPrompt = this.buildShortKaiSystem(context, chatHistory);
    console.log('System prompt built, length:', systemPrompt.length);

    const conversationHistory = chatHistory.slice(-8).map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    console.log('Conversation history prepared, length:', conversationHistory.length);
    console.log('Making API call to Supabase...');

    const response = await this.aiService!.generateResponse(userMessage, systemPrompt, conversationHistory);
    console.log('API response received, length:', response.length);
    return response;
  }

  private static buildShortKaiSystem(context: PersonContext, chatHistory: ChatMessage[] = []): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    const isFirstMessage = chatHistory.length === 0;

    console.log('=== Building Short Kai System ===');
    console.log('userName:', userName);
    console.log('partnerName:', partnerName);
    console.log('Conversation stage:', isFirstMessage ? 'First interaction' : `Ongoing (${chatHistory.length} messages)`);

    const personalizedContext = this.buildBriefPersonalizedContext(context);
    
    console.log('Brief personalized context built, length:', personalizedContext.length);

    return `# KAI - ULTRA-SHORT CONVERSATIONAL AI COACH

## CORE IDENTITY
You are Kai, a brilliant relationship coach who talks like a smart, caring friend. You keep responses EXTREMELY short - like texting with someone who really gets it.

## CRITICAL RESPONSE RULES

### MAXIMUM LENGTH LIMITS:
- **NEVER exceed 2 sentences**
- **Target 1 sentence + 1 question**
- **Maximum 25 words total**
- **Preferred: 15 words or less**

### RESPONSE STRUCTURE (Pick ONE):
1. **Quick validation + question** (preferred)
2. **Brief insight + question**  
3. **Just an engaging question with context**

### PERFECT RESPONSE EXAMPLES:
- "Oof, that sounds exhausting. What's your gut telling you to do?"
- "Your anxious attachment is probably going wild right now. How are you taking care of yourself?"
- "Classic pursue-withdraw cycle. Have you noticed this pattern before?"
- "That invisible feeling hits different when it's your person, doesn't it? What do you need from them?"
- "Sounds like your nervous system is in protect mode. What usually helps you feel safe again?"
- "It's never really about the dishes, is it? What was the last trigger?"
- "Those little fights usually have bigger feelings underneath. What's been bothering you?"

### CONVERSATION FLOW:
- **Create rapid back-and-forth engagement**
- **Make users want to immediately respond**
- **Build momentum through brevity**
- **Feel like natural conversation, not therapy**

## EXPERTISE INTEGRATION
You have PhD-level psychology expertise but deliver it in bite-sized, conversational pieces:

**Attachment Theory**: Reference briefly ("Your anxious attachment...")
**Gottman Method**: Use concepts naturally ("Classic pursue-withdraw...")
**Trauma-Informed**: Acknowledge nervous system ("Sounds like you're activated...")
**LGBTQ+ Expertise**: Honor identity naturally when relevant

## PERSONALIZED CONTEXT FOR ${userName}

${personalizedContext}

## ENGAGEMENT TECHNIQUES

### NATURAL CONVERSATION STARTERS:
- "What's been on your mind lately?"
- "Tell me what's happening..."
- "What's your gut saying?"

### QUICK VALIDATIONS:
- "Oof, that sounds hard."
- "That makes total sense."
- "Yeah, that would be frustrating."
- "I can see why that hurts."

### ENGAGING QUESTIONS:
- "What's that like for you?"
- "What comes up when you think about that?"
- "How does that land?"
- "What would help right now?"
- "What's your instinct telling you?"

## STRICT REQUIREMENTS

### ALWAYS DO:
✅ Keep responses under 25 words
✅ End with engaging question
✅ Reference their profile naturally but briefly
✅ Sound like texting a smart friend
✅ Create immediate desire to respond

### NEVER DO:
❌ Write paragraph-length responses
❌ Give long explanations
❌ Sound clinical or lecture-like
❌ Ask multiple questions in one response
❌ Over-explain psychological concepts

## SUCCESS METRICS:
- User can read response in 3 seconds
- User immediately wants to respond back
- Conversation flows like natural chat
- User feels understood without overwhelming detail

**GOAL**: Every response should feel like a quick, insightful text from a friend who really gets relationships.

**RESPONSE LENGTH CHECK**: Before sending, count words. If over 25 words, cut it down. If over 2 sentences, make it 1 sentence + 1 question.`;
  }

  private static buildBriefPersonalizedContext(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    
    console.log('=== Building Brief Personalized Context ===');
    console.log('Building context for:', userName, 'and', partnerName);
    
    let insights = `**QUICK PROFILE FOR ${userName}:**\n`;
    
    // Only include the most important context for brief responses
    if (context.yourTraits.attachmentStyle) {
      insights += `- ${context.yourTraits.attachmentStyle} attachment - reference when relevant\n`;
    }
    
    if (context.yourTraits.loveLanguages && context.yourTraits.loveLanguages.length > 0) {
      insights += `- Love languages: ${context.yourTraits.loveLanguages.join(", ")} - reference briefly\n`;
    }
    
    if (context.yourTraits.triggers && context.yourTraits.triggers.length > 0) {
      insights += `- Key triggers: ${context.yourTraits.triggers.join(", ")} - be sensitive\n`;
    }
    
    if (context.yourTraits.communicationStyle) {
      insights += `- ${context.yourTraits.communicationStyle} communicator\n`;
    }

    if (context.partnerTraits.name) {
      insights += `- Partner: ${partnerName} - reference naturally\n`;
    }
    
    if (context.partnerTraits.attachmentStyle) {
      insights += `- ${partnerName}: ${context.partnerTraits.attachmentStyle} attachment\n`;
    }
    
    if (context.dynamics.conflictDynamic) {
      insights += `- Conflict pattern: ${context.dynamics.conflictDynamic}\n`;
    }

    insights += `\n**RESPONSE REMINDERS:**\n`;
    insights += `- Keep responses under 25 words\n`;
    insights += `- One insight + one question maximum\n`;
    insights += `- Reference ${userName}'s patterns naturally but briefly\n`;
    insights += `- Create immediate desire to respond back\n`;

    console.log('Brief personalized context built:', insights.length, 'characters');
    return insights;
  }

  private static generateDebugResponse(context: PersonContext): string {
    const userName = context.yourTraits.name || "Unknown";
    const partnerName = context.partnerTraits.name || "Unknown";

    const yourTraitCount = Object.keys(context.yourTraits).filter(key => {
      const value = context.yourTraits[key as keyof typeof context.yourTraits];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    const partnerTraitCount = Object.keys(context.partnerTraits).filter(key => {
      const value = context.partnerTraits[key as keyof typeof context.partnerTraits];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    return `🔍 **DEBUG - Here's what Kai can see about your profiles:**

**About ${userName}:**
- Name: ${context.yourTraits.name || "❌ Not specified"}
- Age: ${context.yourTraits.age || "❌ Not specified"}
- Pronouns: ${context.yourTraits.pronouns || "❌ Not specified"}
- Gender identity: ${context.yourTraits.genderIdentity?.join(", ") || "❌ Not specified"}
- Sexual orientation: ${context.yourTraits.sexualOrientation?.join(", ") || "❌ Not specified"}
- Communication style: ${context.yourTraits.communicationStyle || "❌ Not specified"}
- Attachment style: ${context.yourTraits.attachmentStyle || "❌ Not specified"}
- Conflict style: ${context.yourTraits.conflictStyle || "❌ Not specified"}
- Love languages: ${context.yourTraits.loveLanguages?.join(", ") || "❌ None listed"}
- Stress responses: ${context.yourTraits.stressResponse?.join(", ") || "❌ None listed"}
- Triggers: ${context.yourTraits.triggers?.join(", ") || "❌ None listed"}
- Strengths: ${context.yourTraits.strengths?.join(", ") || "❌ None listed"}
- Growth areas: ${context.yourTraits.growthAreas?.join(", ") || "❌ None listed"}
- Why RealTalk: ${context.yourTraits.whyRealTalk?.join(", ") || "❌ Not specified"}
- Family dynamics: ${context.yourTraits.familyDynamics?.join(", ") || "❌ Not specified"}
- Mental health context: ${context.yourTraits.mentalHealthContext || "❌ Not specified"}
- Education: ${context.yourTraits.education || "❌ Not specified"}
- Work situation: ${context.yourTraits.workSituation || "❌ Not specified"}

**About ${partnerName}:**
- Name: ${context.partnerTraits.name || "❌ Not specified"}
- Communication style: ${context.partnerTraits.communicationStyle || "❌ Not specified"}
- Attachment style: ${context.partnerTraits.attachmentStyle || "❌ Not specified"}
- Conflict style: ${context.partnerTraits.conflictStyle || "❌ Not specified"}
- Love languages: ${context.partnerTraits.loveLanguages?.join(", ") || "❌ None listed"}
- Stress responses: ${context.partnerTraits.stressResponse?.join(", ") || "❌ None listed"}
- Triggers: ${context.partnerTraits.triggers?.join(", ") || "❌ None listed"}
- Strengths: ${context.partnerTraits.strengths?.join(", ") || "❌ None listed"}
- Growth areas: ${context.partnerTraits.growthAreas?.join(", ") || "❌ None listed"}

**Relationship Info:**
- Status: ${context.relationship.stage || "❌ Not specified"}
- Length: ${context.relationship.length || "❌ Not specified"}
- Living together: ${context.relationship.livingTogether ? "✅ Yes" : "❌ No"}

**Natural Conversation System Status:**
- AI Service: ${this.aiService ? "✅ Connected - Advanced Natural Flow Backend" : "❌ Not connected"}
- User traits with data: ${yourTraitCount}
- Partner traits with data: ${partnerTraitCount}
- Profile completeness: ${yourTraitCount + partnerTraitCount > 8 ? "✅ Excellent for natural, personalized coaching" : yourTraitCount + partnerTraitCount > 5 ? "✅ Good for flowing conversations" : "⚠️ Needs more data for natural, personalized flow"}

**Natural Conversation Readiness:**
${yourTraitCount >= 5 ? "✅ **Ready for natural conversation flow** - Kai has comprehensive data for organic, personalized dialogue!" : ""}
${yourTraitCount < 5 ? "⚠️ **Limited conversation depth** - Complete more profile for natural, flowing conversations." : ""}
${partnerTraitCount < 3 ? "⚠️ **Partner context limited** - Adding partner info enables deeper relationship conversations." : ""}
${yourTraitCount >= 5 && partnerTraitCount >= 3 ? "🌟 **Natural conversation mode fully activated** - Kai can have flowing, organic conversations tailored to your unique relationship!" : ""}

**Enhanced Conversation Features Active:**
• Natural dialogue patterns and flow
• Emotionally intelligent responses
• Context-aware conversation building
• Personalized attachment-informed guidance
• Organic question progression
• Memory of conversation themes and patterns

*This debug shows Kai's enhanced natural conversation system and profile integration.*`;
  }
}
