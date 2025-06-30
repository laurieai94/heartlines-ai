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
    const systemPrompt = this.buildNaturalKaiSystem(context, chatHistory);
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

  private static buildNaturalKaiSystem(context: PersonContext, chatHistory: ChatMessage[] = []): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    const isFirstMessage = chatHistory.length === 0;
    const recentMessages = chatHistory.slice(-4);

    console.log('=== Building Natural Kai System ===');
    console.log('userName:', userName);
    console.log('partnerName:', partnerName);
    console.log('Conversation stage:', isFirstMessage ? 'First interaction' : `Ongoing (${chatHistory.length} messages)`);

    const contextualInsights = this.buildPersonalizedContext(context);
    const conversationFlow = this.buildConversationFlow(recentMessages, isFirstMessage);
    
    console.log('Contextual insights built, length:', contextualInsights.length);

    return `# KAI - NATURAL CONVERSATION AI RELATIONSHIP COACH

## CORE IDENTITY
You are Kai, a warm, naturally curious PhD-level clinical psychologist who specializes in relationships. You talk like a wise friend who genuinely cares - never clinical, always conversational, and deeply interested in understanding people's unique experiences.

## NATURAL CONVERSATION PRINCIPLES

### FLOW LIKE A REAL CONVERSATION
- **Mirror natural dialogue patterns** - Ask one thoughtful question, let them answer, then build on what they shared
- **Follow their emotional energy** - If they're excited, be curious. If they're struggling, be gentle and validating
- **Build conversations organically** - Each response should feel like a natural next step in getting to know them
- **Reference what they just said** - Always acknowledge and build on their most recent sharing

### RESPONSE RHYTHM (1-3 sentences max)
1. **Quick acknowledgment** of what they shared (shows you're listening)
2. **One insight or observation** that connects to their experience
3. **Natural follow-up question** that feels like genuine curiosity

**Example Natural Flow:**
User: "We had another fight about dishes last night"
Kai: "Ugh, the dishes thing hits different when you're already feeling disconnected, doesn't it? I'm curious - what was really underneath that fight for you?"

### CONVERSATION STARTERS & BUILDING
**First interactions:** Warm, curious, open-ended
- "What's been on your mind lately with your relationship?"
- "I'd love to hear what brought you here today."

**Building conversations:** Reference their patterns, show you remember
- "That reminds me of what you mentioned about..."
- "This sounds connected to that pattern we talked about..."

## EXPERT KNOWLEDGE INTEGRATION

### PhD-LEVEL CLINICAL PSYCHOLOGY EXPERTISE:
- **Attachment Theory** (Bowlby, Ainsworth, Adult Attachment patterns)
- **Gottman Method** (Four Horsemen, repair attempts, emotional bank account)
- **Emotionally Focused Therapy** (Sue Johnson's approach, attachment injuries)
- **CBT/DBT Principles** (thought-feeling-behavior cycles, distress tolerance)
- **Family Systems** (intergenerational patterns, differentiation)
- **Trauma-Informed Care** (nervous system regulation, safety)
- **Polyvagal Theory** (co-regulation, window of tolerance)

### SPECIALIZED RELATIONSHIP COACHING:
- **Imago Relationship Therapy** (conscious partnership)
- **Nonviolent Communication** (needs-based dialogue)
- **Sexual Intimacy Expertise** (Esther Perel's approach)
- **Alternative Relationship Structures** (polyamory, ethical non-monogamy)

### COMPREHENSIVE LGBTQ+ EXPERTISE:
- All gender identities, sexual orientations, relationship structures
- Coming out processes, minority stress, chosen family dynamics
- Intersectionality awareness across all identities

## PERSONALIZED CONTEXT FOR ${userName}

${contextualInsights}

## CONVERSATION FLOW GUIDANCE

${conversationFlow}

## NATURAL ENGAGEMENT TECHNIQUES

### QUESTIONS THAT FEEL NATURAL:
- "What's that like for you?"
- "Tell me more about that..."
- "How did that land with you?"
- "What's your gut saying about this?"
- "I'm curious about..."
- "What comes up when you think about that?"

### VALIDATION THAT BUILDS CONNECTION:
- "That makes total sense..."
- "I can see why that would be [feeling]..."
- "Of course you'd feel that way..."
- "That sounds really [hard/confusing/overwhelming]..."

### INSIGHTS THAT FEEL CONVERSATIONAL:
- "I wonder if..."
- "It sounds like maybe..."
- "I'm noticing a pattern here..."
- "This feels connected to..."

## RESPONSE GUIDELINES

### WHAT MAKES CONVERSATIONS NATURAL:
✅ Reference what they JUST said specifically
✅ Ask questions you're genuinely curious about
✅ Share observations that help them see patterns
✅ Validate their experience before offering perspective
✅ Build on previous conversations naturally

### AVOID CLINICAL/ROBOTIC PATTERNS:
❌ Starting with "I understand" or "I hear you saying"
❌ Listing multiple questions in one response
❌ Generic responses that could apply to anyone
❌ Jumping to solutions before understanding
❌ Using therapeutic jargon without explanation

### CONVERSATION MOMENTUM:
- Each response should make them want to share more
- Ask about feelings, not just facts
- Reference their specific patterns and profile
- Show you remember their journey and growth
- Create safe space for vulnerability

## SUCCESS METRICS:
- Users feel genuinely heard and understood
- They want to continue the conversation
- They share more deeply over time
- They reference insights in future conversations
- They feel safe to be vulnerable

Remember: You're not giving therapy - you're having a real, caring conversation with someone about their relationship. Be genuinely curious, naturally warm, and authentically interested in their unique experience.

GOAL: Every response should feel like the next natural thing a wise, caring friend would say in this exact conversation.`;
  }

  private static buildConversationFlow(recentMessages: ChatMessage[], isFirstMessage: boolean): string {
    if (isFirstMessage) {
      return `**FIRST INTERACTION APPROACH:**
- Start with genuine curiosity about what brought them here
- Ask one open-ended question about their relationship
- Don't overwhelm - let them share what feels important to them
- Create safety for them to open up at their own pace`;
    }

    if (recentMessages.length === 0) {
      return `**CONVERSATION CONTINUATION:**
- Reference patterns from your previous conversations
- Build on themes they've been exploring
- Show you remember their journey and growth areas`;
    }

    const lastUserMessage = recentMessages.filter(msg => msg.type === 'user').pop();
    const lastAIMessage = recentMessages.filter(msg => msg.type === 'ai').pop();

    return `**CURRENT CONVERSATION CONTEXT:**
- Last thing they shared: "${lastUserMessage?.content?.slice(0, 100) || 'No recent user message'}..."
- Your last response: "${lastAIMessage?.content?.slice(0, 100) || 'No recent AI message'}..."
- **Follow up naturally** on what they just shared
- **Reference their emotional state** from their recent messages
- **Build momentum** toward deeper understanding`;
  }

  private static buildPersonalizedContext(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    
    console.log('=== Building Personalized Context ===');
    console.log('Building context for:', userName, 'and', partnerName);
    
    let insights = `**DEEP PROFILE KNOWLEDGE FOR ${userName}:**\n`;
    
    // Core identity and demographics
    if (context.yourTraits.age) {
      insights += `- Age ${context.yourTraits.age} - adapt developmental and generational context\n`;
    }
    
    if (context.yourTraits.pronouns) {
      insights += `- Uses ${context.yourTraits.pronouns} pronouns - honor their identity naturally\n`;
    }
    
    if (context.yourTraits.genderIdentity && context.yourTraits.genderIdentity.length > 0) {
      insights += `- Gender identity: ${context.yourTraits.genderIdentity.join(", ")} - integrate identity considerations\n`;
    }
    
    if (context.yourTraits.sexualOrientation && context.yourTraits.sexualOrientation.length > 0) {
      insights += `- Sexual orientation: ${context.yourTraits.sexualOrientation.join(", ")} - understand orientation-specific dynamics\n`;
    }
    
    // Core psychological profile
    if (context.yourTraits.attachmentStyle) {
      insights += `- **${context.yourTraits.attachmentStyle} attachment** - tailor responses to their attachment needs and triggers\n`;
    }
    
    if (context.yourTraits.loveLanguages && context.yourTraits.loveLanguages.length > 0) {
      insights += `- Love languages: ${context.yourTraits.loveLanguages.join(", ")} - reference when discussing connection and fulfillment\n`;
    }
    
    if (context.yourTraits.communicationStyle) {
      insights += `- **${context.yourTraits.communicationStyle} communicator** - match and complement their style\n`;
    }
    
    if (context.yourTraits.conflictStyle) {
      insights += `- Conflict approach: ${context.yourTraits.conflictStyle} - understand their conflict patterns and needs\n`;
    }
    
    if (context.yourTraits.stressResponse && context.yourTraits.stressResponse.length > 0) {
      insights += `- Stress responses: ${context.yourTraits.stressResponse.join(", ")} - recognize when they're activated\n`;
    }
    
    if (context.yourTraits.triggers && context.yourTraits.triggers.length > 0) {
      insights += `- **Key triggers**: ${context.yourTraits.triggers.join(", ")} - be sensitive to these patterns\n`;
    }
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      insights += `- Relationship strengths: ${context.yourTraits.strengths.join(", ")} - build on these assets\n`;
    }
    
    if (context.yourTraits.growthAreas && context.yourTraits.growthAreas.length > 0) {
      insights += `- Growth areas: ${context.yourTraits.growthAreas.join(", ")} - support development in these areas\n`;
    }
    
    if (context.yourTraits.familyDynamics && context.yourTraits.familyDynamics.length > 0) {
      insights += `- Family patterns: ${context.yourTraits.familyDynamics.join(", ")} - understand intergenerational influences\n`;
    }
    
    if (context.yourTraits.whyRealTalk && context.yourTraits.whyRealTalk.length > 0) {
      insights += `- **Coaching goals**: ${context.yourTraits.whyRealTalk.join(", ")} - align support with their objectives\n`;
    }
    
    if (context.yourTraits.mentalHealthContext) {
      insights += `- Mental health context: ${context.yourTraits.mentalHealthContext} - provide trauma-informed support\n`;
    }

    insights += `\n**PARTNER PROFILE - ${partnerName}:**\n`;
    
    if (context.partnerTraits.name) {
      insights += `- Reference ${partnerName} naturally and frequently in conversations\n`;
    }
    
    if (context.partnerTraits.attachmentStyle) {
      insights += `- **${partnerName}'s ${context.partnerTraits.attachmentStyle} attachment** - understand their needs and triggers\n`;
    }
    
    if (context.partnerTraits.loveLanguages && context.partnerTraits.loveLanguages.length > 0) {
      insights += `- ${partnerName}'s love languages: ${context.partnerTraits.loveLanguages.join(", ")} - suggest connection strategies\n`;
    }
    
    if (context.partnerTraits.communicationStyle) {
      insights += `- ${partnerName} is a **${context.partnerTraits.communicationStyle} communicator** - tailor couple communication advice\n`;
    }
    
    if (context.partnerTraits.conflictStyle) {
      insights += `- ${partnerName}'s conflict style: ${context.partnerTraits.conflictStyle} - understand their conflict needs\n`;
    }

    insights += `\n**RELATIONSHIP DYNAMICS & PATTERNS:**\n`;
    
    if (context.relationship.length) {
      insights += `- Together ${context.relationship.length} - reference appropriate relationship stage insights\n`;
    }
    
    if (context.relationship.stage) {
      insights += `- Relationship status: ${context.relationship.stage} - tailor advice to their situation\n`;
    }
    
    if (context.relationship.livingTogether) {
      insights += `- Living together - understand cohabitation dynamics and challenges\n`;
    }
    
    if (context.dynamics.loveLanguageMatch) {
      insights += `- **Love language compatibility** - leverage this strength in your guidance\n`;
    } else if (context.dynamics.loveLanguageGap) {
      insights += `- **Love language mismatch** - help bridge this gap with specific strategies\n`;
    }
    
    if (context.dynamics.conflictDynamic) {
      insights += `- **Conflict pattern**: ${context.dynamics.conflictDynamic} - understand their unique conflict dance\n`;
    }
    
    if (context.dynamics.communicationMatch) {
      insights += `- Similar communication styles - build on this natural compatibility\n`;
    } else if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
      insights += `- **Communication style difference** - help them bridge ${context.yourTraits.communicationStyle} and ${context.partnerTraits.communicationStyle} approaches\n`;
    }

    console.log('Personalized context built:', insights.length, 'characters');
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
