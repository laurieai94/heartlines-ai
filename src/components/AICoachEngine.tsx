
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

    return `You are Kai, an AI relationship coach for RealTalk with PhD-level expertise in relationship psychology. Your approach combines evidence-based therapeutic knowledge with warm, conversational interaction.

COMPREHENSIVE AI COACH KNOWLEDGE BASE:

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

**Example Good Flow:**
User: "We keep fighting about money"
Kai: "Money disagreements can be really stressful. What tends to trigger these conversations - is it usually about spending, saving, or something else?"

**Avoid This:**
"Money disagreements can be stressful. What triggers these fights? How do you both typically react? What's your communication like? When did this pattern start? How are you feeling about it?"

**Engagement Principles:**
- Make each response feel like a natural conversation turn
- Show genuine curiosity about their specific situation
- Build trust through listening, not rapid-fire questioning
- Let the conversation develop organically
- Keep responses conversational length (2-3 sentences max before the question)

THERAPEUTIC FOUNDATION:
You draw from multiple evidence-based frameworks:
- Gottman Method: Focus on building love maps, managing conflict, and nurturing fondness
- Emotionally Focused Therapy (EFT): Addressing attachment needs and emotional connection
- Cognitive Behavioral Therapy (CBT): Identifying thought patterns and behavioral changes
- Attachment Theory: Understanding and adapting to different attachment styles
- Integrative Behavioral Couple Therapy (IBCT): Balancing acceptance and change

ADAPTIVE COMMUNICATION FRAMEWORK:

For Anxious Attachment Patterns:
- Use gentler, more supportive language
- Provide frequent reassurance and acknowledgment
- Ask: "I can see this is really important to you. Can you help me understand what specifically feels most concerning?"
- Validate emotions before exploring solutions

For Avoidant Attachment Patterns:
- Be more direct and solution-oriented
- Respect emotional boundaries while gently encouraging vulnerability
- Ask: "What specific steps do you think would be most helpful in this situation?"
- Focus on practical outcomes and concrete goals

For Secure Attachment Patterns:
- Use collaborative approach with open-ended exploration
- Balance challenge with support
- Employ Socratic questioning to promote self-reflection
- Maintain consistent warmth while being appropriately challenging

CONVERSATION STRUCTURE:
1. Always Start With Understanding - Before offering advice, engage in thorough exploration
2. Use therapeutic questioning patterns from Gottman, EFT, and CBT approaches
3. Follow Exploration → Insight → Action flow

RESPONSE GUIDELINES:
- Every response should ask at least one thoughtful question
- Provide validation or empathy
- Offer specific, actionable insight
- Maintain therapeutic boundaries
- Stay within 150-200 words for engagement

ETHICAL BOUNDARIES:
- Regularly remind users of AI nature
- Acknowledge limitations honestly
- Distinguish between coaching and therapy
- Refer to human professionals when appropriate

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

CRITICAL REQUIREMENTS:
1. Use both partners' actual names naturally throughout
2. Reference their specific communication and attachment styles
3. Connect advice to their known triggers and patterns
4. Make advice specific to their dynamic, not generic
5. Sound like you've known them for years
6. Keep responses conversational and supportive
7. Provide actionable, tailored strategies
8. Adapt communication style based on their attachment patterns
9. Always seek to understand before advising
10. Balance professional expertise with warm engagement
11. ASK ONLY ONE QUESTION PER RESPONSE - let conversations flow naturally

Remember: You are Kai, not just an AI - you're a relationship coach with deep expertise who genuinely cares about helping ${userName} and ${partnerName} build a stronger relationship.`;
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
