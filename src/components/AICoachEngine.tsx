
import { PersonContext, ChatMessage } from "@/types/AIInsights";
import { AIService } from "@/services/aiService";

export class AICoachEngine {
  private static aiService: AIService | null = null;

  static setSupabaseConfig(supabaseUrl: string, supabaseAnonKey: string) {
    this.aiService = new AIService({ supabaseUrl, supabaseAnonKey });
    console.log('AI Service configured for Supabase backend');
  }

  static initializeSupabase() {
    // Use the hardcoded Supabase config from the client file
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

    // Helper function to extract array values safely
    const extractArrayValue = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    };

    // Helper function to extract single value safely
    const extractSingleValue = (value: any): string | undefined => {
      if (Array.isArray(value)) return value[0];
      if (typeof value === 'string') return value;
      return undefined;
    };

    // Build context from the unified profile data
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
    const systemPrompt = enhancedPrompt || this.buildSystemPrompt(context);
    console.log('System prompt built, length:', systemPrompt.length);

    const conversationHistory = chatHistory.slice(-6).map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    console.log('Conversation history prepared, length:', conversationHistory.length);
    console.log('Making API call to Supabase...');

    const response = await this.aiService!.generateResponse(userMessage, systemPrompt, conversationHistory);
    console.log('API response received, length:', response.length);
    return response;
  }

  private static buildSystemPrompt(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";

    console.log('=== Building System Prompt ===');
    console.log('userName:', userName);
    console.log('partnerName:', partnerName);
    console.log('Has user profile data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length > 1);

    // Build dynamic contextual insights
    const contextualInsights = this.buildContextualInsights(context);
    console.log('Contextual insights built, length:', contextualInsights.length);

    return `You are Kai, an AI relationship coach for RealTalk with PhD-level expertise in relationship psychology. Your approach combines evidence-based therapeutic knowledge with warm, conversational interaction.

CORE IDENTITY & PERSONALITY:
- Warm, empathetic, and professional without being clinical or formal
- Curious and thoughtful, always seeking to understand before advising
- Adaptable in communication style based on user needs and patterns
- Authentic about being AI while maintaining therapeutic credibility
- Supportive yet challenging when appropriate

CONVERSATIONAL PACING - KEEP IT NATURAL:

**ONE Question at a Time:**
- Ask only ONE meaningful question per response
- Let the user answer before diving deeper
- Build understanding gradually, not through interrogation

**Flow Pattern:**
1. **First Response:** Welcome + ONE open question about their situation
2. **Follow-ups:** Acknowledge what they shared + ONE deeper question
3. **Keep Building:** Show you're listening + explore ONE new angle

**Engagement Principles:**
- Make each response feel like a natural conversation turn
- Show genuine curiosity about their specific situation
- Build trust through listening, not rapid-fire questioning
- Let the conversation develop organically
- Keep responses conversational length (2-3 sentences max before the question)

CONTEXTUAL PERSONALIZATION - CRITICAL:
You have deep knowledge about ${userName} and ${partnerName}. Use this information naturally and smoothly in your responses:

${contextualInsights}

**Integration Guidelines:**
- Weave profile insights naturally into conversations - don't just state facts
- Connect current topics to their known patterns and traits
- Reference their specific dynamics when giving advice
- Use their names frequently and naturally
- Show you remember previous conversations and their growth areas
- Tailor your communication style to match their attachment and communication preferences

THERAPEUTIC FOUNDATION:
You draw from multiple evidence-based frameworks:
- Gottman Method: Focus on building love maps, managing conflict, and nurturing fondness
- Emotionally Focused Therapy (EFT): Addressing attachment needs and emotional connection
- Cognitive Behavioral Therapy (CBT): Identifying thought patterns and behavioral changes
- Attachment Theory: Understanding and adapting to different attachment styles
- Integrative Behavioral Couple Therapy (IBCT): Balancing acceptance and change

ADAPTIVE COMMUNICATION FRAMEWORK:

For ${userName}'s ${context.yourTraits.attachmentStyle || 'Unknown'} Attachment Style:
${this.getAttachmentGuidance(context.yourTraits.attachmentStyle)}

For ${partnerName}'s ${context.partnerTraits.attachmentStyle || 'Unknown'} Attachment Style:
${this.getAttachmentGuidance(context.partnerTraits.attachmentStyle)}

CONVERSATION STRUCTURE:
1. Always Start With Understanding - Before offering advice, engage in thorough exploration
2. Use therapeutic questioning patterns from Gottman, EFT, and CBT approaches
3. Follow Exploration → Insight → Action flow

RESPONSE GUIDELINES:
- Every response should ask at least one thoughtful question
- Provide validation or empathy
- Offer specific, actionable insight tailored to their profile
- Maintain therapeutic boundaries
- Stay within 150-200 words for engagement
- Reference their profile naturally - don't sound robotic

ETHICAL BOUNDARIES:
- Regularly remind users of AI nature
- Acknowledge limitations honestly
- Distinguish between coaching and therapy
- Refer to human professionals when appropriate

CRITICAL REQUIREMENTS:
1. Use both partners' actual names naturally throughout - ${userName} and ${partnerName}
2. Reference their specific communication and attachment styles in context
3. Connect advice to their known triggers and patterns
4. Make advice specific to their dynamic, not generic
5. Sound like you've known them for years and remember their journey
6. Keep responses conversational and supportive
7. Provide actionable, tailored strategies based on their profiles
8. Adapt communication style based on their attachment patterns
9. Always seek to understand before advising
10. Balance professional expertise with warm engagement
11. ASK ONLY ONE QUESTION PER RESPONSE - let conversations flow naturally
12. Naturally weave in profile insights without being obvious about it

Remember: You are Kai, not just an AI - you're a relationship coach with deep expertise who genuinely cares about helping ${userName} and ${partnerName} build a stronger relationship. You know them well and can reference their journey, growth areas, and specific dynamics naturally in conversation.`;
  }

  private static buildContextualInsights(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    
    console.log('=== Building Contextual Insights ===');
    console.log('Building insights for:', userName, 'and', partnerName);
    
    let insights = `**About ${userName}:**\n`;
    
    if (context.yourTraits.age) {
      insights += `- Age: ${context.yourTraits.age} - adapt communication style accordingly\n`;
    }
    
    if (context.yourTraits.pronouns) {
      insights += `- Uses ${context.yourTraits.pronouns} pronouns - respect their identity\n`;
    }
    
    if (context.yourTraits.loveLanguages && context.yourTraits.loveLanguages.length > 0) {
      insights += `- Love languages: ${context.yourTraits.loveLanguages.join(', ')} - use this to frame relationship advice\n`;
    }
    
    if (context.yourTraits.communicationStyle) {
      insights += `- Communication style: ${context.yourTraits.communicationStyle} - adapt your approach accordingly\n`;
    }
    
    if (context.yourTraits.attachmentStyle) {
      insights += `- Attachment style: ${context.yourTraits.attachmentStyle} - be sensitive to their attachment needs\n`;
    }
    
    if (context.yourTraits.stressResponse && context.yourTraits.stressResponse.length > 0) {
      insights += `- Under stress: ${context.yourTraits.stressResponse.join(', ')} - consider this when discussing conflicts\n`;
    }
    
    if (context.yourTraits.triggers && context.yourTraits.triggers.length > 0) {
      insights += `- Known triggers: ${context.yourTraits.triggers.join(', ')} - be mindful of these topics\n`;
    }
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      insights += `- Strengths to leverage: ${context.yourTraits.strengths.join(', ')}\n`;
    }

    if (context.yourTraits.growthAreas && context.yourTraits.growthAreas.length > 0) {
      insights += `- Growth areas: ${context.yourTraits.growthAreas.join(', ')} - help them work on these\n`;
    }

    if (context.yourTraits.whyRealTalk && context.yourTraits.whyRealTalk.length > 0) {
      insights += `- Why they're using RealTalk: ${context.yourTraits.whyRealTalk.join(', ')} - keep their goals in mind\n`;
    }

    if (context.yourTraits.familyDynamics && context.yourTraits.familyDynamics.length > 0) {
      insights += `- Family background: ${context.yourTraits.familyDynamics.join(', ')} - consider family patterns\n`;
    }

    insights += `\n**About ${partnerName}:**\n`;
    
    if (context.partnerTraits.loveLanguages && context.partnerTraits.loveLanguages.length > 0) {
      insights += `- Love languages: ${context.partnerTraits.loveLanguages.join(', ')} - reference when discussing how to connect\n`;
    }
    
    if (context.partnerTraits.communicationStyle) {
      insights += `- Communication style: ${context.partnerTraits.communicationStyle} - suggest approaches that work for them\n`;
    }
    
    if (context.partnerTraits.attachmentStyle) {
      insights += `- Attachment style: ${context.partnerTraits.attachmentStyle} - consider their attachment needs\n`;
    }
    
    if (context.partnerTraits.conflictStyle) {
      insights += `- Conflict approach: ${context.partnerTraits.conflictStyle} - tailor conflict resolution advice\n`;
    }

    insights += `\n**Relationship Dynamics:**\n`;
    
    if (context.relationship.length) {
      insights += `- Together for ${context.relationship.length} - reference their relationship stage\n`;
    }
    
    if (context.relationship.stage) {
      insights += `- Relationship status: ${context.relationship.stage} - tailor advice to their situation\n`;
    }
    
    if (context.dynamics.loveLanguageMatch) {
      insights += `- Both share similar love languages - highlight this strength\n`;
    } else if (context.dynamics.loveLanguageGap) {
      insights += `- Different love languages - help bridge this gap naturally\n`;
    }
    
    if (context.dynamics.conflictDynamic) {
      insights += `- Conflict dynamic: ${context.dynamics.conflictDynamic} - tailor conflict advice to this pattern\n`;
    }

    console.log('Contextual insights built:', insights.length, 'characters');
    return insights;
  }

  private static getAttachmentGuidance(attachmentStyle?: string): string {
    switch (attachmentStyle) {
      case 'Secure':
        return '- Use collaborative approach with open-ended exploration\n- Balance challenge with support\n- Employ Socratic questioning to promote self-reflection';
      case 'Anxious':
        return '- Use gentler, more supportive language\n- Provide frequent reassurance and acknowledgment\n- Validate emotions before exploring solutions';
      case 'Fearful-Avoidant':
        return '- Be patient and respectful of boundaries\n- Gently encourage vulnerability without pressure\n- Focus on building safety and trust first';
      default:
        return '- Adapt communication style based on their responses\n- Pay attention to their comfort level with emotional topics';
    }
  }

  private static generateDebugResponse(context: PersonContext): string {
    const userName = context.yourTraits.name || "Unknown";
    const partnerName = context.partnerTraits.name || "Unknown";

    // Count defined fields
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
- Education: ${context.yourTraits.education || "❌ Not specified"}
- Work situation: ${context.yourTraits.workSituation || "❌ Not specified"}
- Sexual orientation: ${context.yourTraits.sexualOrientation?.join(", ") || "❌ Not specified"}
- Gender identity: ${context.yourTraits.genderIdentity?.join(", ") || "❌ Not specified"}

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

**System Status:**
- AI Service: ${this.aiService ? "✅ Connected - Supabase Backend" : "❌ Not connected"}
- User traits with data: ${yourTraitCount}
- Partner traits with data: ${partnerTraitCount}
- Total profile completeness: ${yourTraitCount + partnerTraitCount > 5 ? "✅ Good" : "⚠️ Needs more data"}

**Data Quality Check:**
${yourTraitCount < 3 ? "⚠️ **User profile is very incomplete** - Kai needs more information to provide personalized coaching." : ""}
${partnerTraitCount < 2 ? "⚠️ **Partner profile is incomplete** - Consider adding partner information for better relationship insights." : ""}
${yourTraitCount >= 5 ? "✅ **User profile looks good** - Kai has enough information to provide personalized coaching!" : ""}

**Next Steps:**
${yourTraitCount < 5 ? "• Complete your personal profile in the sidebar to help Kai understand you better\n" : ""}
${partnerTraitCount < 2 ? "• Add partner profile information for more comprehensive relationship guidance\n" : ""}
${yourTraitCount >= 5 && partnerTraitCount >= 2 ? "• ✅ Profiles look great! Kai should be able to provide personalized coaching." : ""}

*This debug info shows exactly what data Kai can access. If any important information is missing, try completing your profiles in the sidebar.*`;
  }
}
