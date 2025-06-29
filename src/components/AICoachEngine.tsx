
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

    // Helper function to derive communication style from profile responses
    const deriveCommunicationStyle = (profile: any) => {
      if (profile.directCommunication === "Strongly Agree") return "Direct";
      if (profile.gentleApproach === "Strongly Agree") return "Gentle";
      if (profile.needTimeToProcess === "Strongly Agree") return "Thoughtful";
      return undefined;
    };

    // Helper function to derive love language from profile responses
    const deriveLoveLanguage = (profile: any) => {
      const scores = {
        'Words of Affirmation': (profile.wordsOfAffirmation === "Strongly Agree" ? 2 : profile.wordsOfAffirmation === "Agree" ? 1 : 0) +
                               (profile.proudOfYouAffirmations === "Strongly Agree" ? 2 : profile.proudOfYouAffirmations === "Agree" ? 1 : 0),
        'Quality Time': (profile.qualityTime === "Strongly Agree" ? 2 : profile.qualityTime === "Agree" ? 1 : 0) +
                       (profile.qualityTimeUndividedAttention === "Strongly Agree" ? 2 : profile.qualityTimeUndividedAttention === "Agree" ? 1 : 0),
        'Physical Touch': (profile.physicalTouch === "Strongly Agree" ? 2 : profile.physicalTouch === "Agree" ? 1 : 0) +
                         (profile.casualTouchThroughoutDay === "Strongly Agree" ? 2 : profile.casualTouchThroughoutDay === "Agree" ? 1 : 0),
        'Acts of Service': (profile.householdChoresService === "Strongly Agree" ? 2 : profile.householdChoresService === "Agree" ? 1 : 0) +
                          (profile.practicalHelpRelieves === "Strongly Agree" ? 2 : profile.practicalHelpRelieves === "Agree" ? 1 : 0),
        'Receiving Gifts': (profile.thoughtfulVsExpensiveGifts === "Strongly Agree" ? 2 : profile.thoughtfulVsExpensiveGifts === "Agree" ? 1 : 0)
      };
      
      const maxScore = Math.max(...Object.values(scores));
      if (maxScore === 0) return undefined;
      
      return Object.keys(scores).find(key => scores[key] === maxScore);
    };

    // Helper function to derive stress response
    const deriveStressResponse = (profile: any) => {
      if (profile.talkThroughStressImmediately === "Strongly Agree") return "Talk it out immediately";
      if (profile.needSpaceToProcess === "Strongly Agree") return "Need space to process";
      if (profile.withdrawWhenOverwhelmed === "Strongly Agree") return "Withdraw when overwhelmed";
      if (profile.physicalComfortHelps === "Strongly Agree") return "Seek physical comfort";
      return undefined;
    };

    // Helper function to derive attachment style
    const deriveAttachmentStyle = (profile: any) => {
      if (profile.comfortableClosenessIndependence === "Strongly Agree") return "Secure";
      if (profile.worryRelationshipSecurity === "Strongly Agree") return "Anxious";
      if (profile.wantClosenessButFearHurt === "Strongly Agree") return "Fearful-Avoidant";
      return undefined;
    };

    // Helper function to derive conflict style
    const deriveConflictStyle = (profile: any) => {
      if (profile.needToTalkImmediately === "Strongly Agree") return "Direct confrontation";
      if (profile.goSilentWhenUpset === "Strongly Agree") return "Withdrawal";
      if (profile.feelHeardWithValidation === "Strongly Agree") return "Collaborative";
      return undefined;
    };

    // Helper function to extract triggers
    const extractTriggers = (profile: any) => {
      const triggers = [];
      if (profile.beingRushedMakesWorse === "Strongly Agree") triggers.push("Being rushed");
      if (profile.socialSituationsAnxious === "Strongly Agree") triggers.push("Social situations");
      return triggers;
    };

    // Helper function to extract strengths
    const extractStrengths = (profile: any) => {
      const strengths = [];
      if (profile.improvingCommunicationFocus === "Strongly Agree") strengths.push("Focused on improving communication");
      if (profile.workingOnPersonalDevelopment === "Strongly Agree") strengths.push("Committed to personal growth");
      if (profile.learnedHealthyFromFamily === "Strongly Agree") strengths.push("Learned healthy patterns from family");
      return strengths;
    };

    const context = {
      relationship: {
        length: yourProfile.relationshipLength || partnerProfile.relationshipLength || undefined,
        livingTogether: yourDemographics.livingTogether || false,
        stage: yourProfile.relationshipType || partnerProfile.relationshipType || undefined
      },
      yourTraits: {
        name: yourDemographics.name || undefined,
        loveLanguage: deriveLoveLanguage(yourProfile),
        communicationStyle: deriveCommunicationStyle(yourProfile),
        conflictStyle: deriveConflictStyle(yourProfile),
        stressResponse: deriveStressResponse(yourProfile),
        attachmentStyle: deriveAttachmentStyle(yourProfile),
        triggers: extractTriggers(yourProfile),
        strengths: extractStrengths(yourProfile),
        growthAreas: []
      },
      partnerTraits: {
        name: partnerDemographics.name || undefined,
        loveLanguage: deriveLoveLanguage(partnerProfile),
        communicationStyle: deriveCommunicationStyle(partnerProfile),
        conflictStyle: deriveConflictStyle(partnerProfile),
        stressResponse: deriveStressResponse(partnerProfile),
        attachmentStyle: deriveAttachmentStyle(partnerProfile),
        triggers: extractTriggers(partnerProfile),
        strengths: extractStrengths(partnerProfile),
        growthAreas: []
      },
      dynamics: {
        loveLanguageMatch: deriveLoveLanguage(yourProfile) === deriveLoveLanguage(partnerProfile),
        loveLanguageGap: deriveLoveLanguage(yourProfile) !== deriveLoveLanguage(partnerProfile),
        communicationMatch: deriveCommunicationStyle(yourProfile) === deriveCommunicationStyle(partnerProfile),
        conflictDynamic: deriveConflictStyle(yourProfile) && deriveConflictStyle(partnerProfile) ? 
          `${deriveConflictStyle(yourProfile)}-${deriveConflictStyle(partnerProfile)}` : undefined
      }
    };

    console.log('Final context built:', context);
    return context;
  }

  static async getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = [], enhancedPrompt?: string): Promise<string> {
    console.log('Getting AI response via Supabase...');
    console.log('Context being used:', context);

    // Debug command
    if (userMessage.toUpperCase().includes("DEBUG PROFILES")) {
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

    // Build dynamic contextual insights
    const contextualInsights = this.buildContextualInsights(context);

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
    
    let insights = `**About ${userName}:**\n`;
    
    if (context.yourTraits.loveLanguage) {
      insights += `- Primary love language is ${context.yourTraits.loveLanguage} - use this to frame relationship advice\n`;
    }
    
    if (context.yourTraits.communicationStyle) {
      insights += `- Communication style: ${context.yourTraits.communicationStyle} - adapt your approach accordingly\n`;
    }
    
    if (context.yourTraits.attachmentStyle) {
      insights += `- Attachment style: ${context.yourTraits.attachmentStyle} - be sensitive to their attachment needs\n`;
    }
    
    if (context.yourTraits.stressResponse) {
      insights += `- Under stress: ${context.yourTraits.stressResponse} - consider this when discussing conflicts\n`;
    }
    
    if (context.yourTraits.triggers && context.yourTraits.triggers.length > 0) {
      insights += `- Known triggers: ${context.yourTraits.triggers.join(', ')} - be mindful of these topics\n`;
    }
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      insights += `- Strengths to leverage: ${context.yourTraits.strengths.join(', ')}\n`;
    }

    insights += `\n**About ${partnerName}:**\n`;
    
    if (context.partnerTraits.loveLanguage) {
      insights += `- Primary love language is ${context.partnerTraits.loveLanguage} - reference when discussing how to connect\n`;
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
    
    if (context.dynamics.loveLanguageMatch) {
      insights += `- Both share the same love language - highlight this strength\n`;
    } else if (context.dynamics.loveLanguageGap) {
      insights += `- Different love languages - help bridge this gap naturally\n`;
    }
    
    if (context.dynamics.conflictDynamic) {
      insights += `- Conflict dynamic: ${context.dynamics.conflictDynamic} - tailor conflict advice to this pattern\n`;
    }

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

    return `DEBUG - Here's what Kai can see:

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

**AI Service Status:** ${this.aiService ? "Connected - Supabase Backend" : "Not connected"}

Kai is ready with comprehensive relationship psychology expertise. If any profile data is wrong or missing, there's a profile access issue.`;
  }
}
