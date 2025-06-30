import { AIService } from "@/services/aiService";
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemo = demographicsData.your || {};
    const partnerDemo = demographicsData.partner || {};

    // Merge profile and demographics data
    const yourData = { ...yourProfile, ...yourDemo };
    const partnerData = { ...partnerProfile, ...partnerDemo };

    return {
      relationship: {
        length: yourData.relationshipLength || yourData.relationshipStatus,
        livingTogether: yourData.livingTogether,
        stage: yourData.relationshipStage
      },
      yourTraits: {
        name: yourData.name,
        age: yourData.age,
        pronouns: yourData.pronouns,
        loveLanguages: yourData.loveLanguages || [],
        communicationStyle: yourData.communicationStyle,
        conflictStyle: yourData.conflictStyle,
        stressResponse: yourData.stressResponse || [],
        attachmentStyle: yourData.attachmentStyle,
        triggers: yourData.triggers || [],
        strengths: yourData.strengths || [],
        growthAreas: yourData.growthAreas || [],
        familyDynamics: yourData.familyDynamics || [],
        whyRealTalk: yourData.whyRealTalk || [],
        mentalHealthContext: yourData.mentalHealthContext,
        education: yourData.education,
        workSituation: yourData.workSituation,
        sexualOrientation: yourData.sexualOrientation || [],
        genderIdentity: yourData.genderIdentity || []
      },
      partnerTraits: {
        name: partnerData.name,
        loveLanguages: partnerData.loveLanguages || [],
        communicationStyle: partnerData.communicationStyle,
        conflictStyle: partnerData.conflictStyle,
        stressResponse: partnerData.stressResponse || [],
        attachmentStyle: partnerData.attachmentStyle,
        triggers: partnerData.triggers || [],
        strengths: partnerData.strengths || [],
        growthAreas: partnerData.growthAreas || []
      },
      dynamics: {
        loveLanguageMatch: yourData.loveLanguages?.some(lang => 
          partnerData.loveLanguages?.includes(lang)
        ),
        loveLanguageGap: yourData.loveLanguages?.length > 0 && 
          partnerData.loveLanguages?.length > 0 &&
          !yourData.loveLanguages.some(lang => 
            partnerData.loveLanguages.includes(lang)
          ),
        communicationMatch: yourData.communicationStyle === partnerData.communicationStyle,
        conflictDynamic: `${yourData.conflictStyle || 'unknown'} + ${partnerData.conflictStyle || 'unknown'}`
      }
    };
  }

  static initializeSupabase(): boolean {
    // Use hardcoded values from the Supabase client instead of environment variables
    const supabaseUrl = "https://relqmhrzyqckoaebscgx.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE";
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration missing');
      return false;
    }
    
    return true;
  }

  static async getAIResponse(
    userMessage: string, 
    context: PersonContext, 
    conversationHistory: any[] = [],
    customPrompt?: string
  ): Promise<string> {
    // Use hardcoded values from the Supabase client instead of environment variables
    const supabaseUrl = "https://relqmhrzyqckoaebscgx.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE";

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('🔧 **Configuration Required**\n\nPlease configure your Supabase settings to enable AI chat functionality.');
    }

    try {
      const aiService = new AIService({
        supabaseUrl: supabaseUrl!,
        supabaseAnonKey: supabaseAnonKey!
      });

      // Enhanced conversation strategy - discovery before advice
      const conversationCount = conversationHistory.length;
      const isEarlyConversation = conversationCount < 6; // First 3 exchanges (user + AI pairs)
      
      const discoveryPrompt = `You are Kai, a PhD-level clinical psychologist and certified life coach specializing in deep understanding and discovery-based conversations.

CRITICAL CONVERSATION STRATEGY - DISCOVERY FIRST:

**Phase 1: Deep Discovery (First 3-5 exchanges)**
- Ask ONE powerful discovery question per response
- Explore emotions, reactions, and context thoroughly
- Understand the full situation before ANY advice
- Be genuinely curious about their experience

**Response Format:**
- Maximum 15-20 words total
- One brief validation (3-5 words) + One discovery question (8-12 words)
- End every response with an engaging question
- Keep it conversational, like texting a smart friend

**Discovery Question Types:**
${isEarlyConversation ? `
- "What exactly happened?" (situation)
- "How did that make you feel?" (emotions)  
- "What went through your mind?" (thoughts)
- "What's the feeling underneath that?" (deeper emotions)
- "When else have you felt this way?" (patterns)
- "What's your gut telling you?" (intuition)
- "What does your partner usually do when...?" (dynamics)
` : `
- "How does this connect to your ${context.yourTraits.attachmentStyle || 'attachment'} style?"
- "Does this remind you of your family dynamics?"
- "What patterns are you noticing?"
- "How might your partner be feeling?"
- "What would help you feel safe right now?"
`}

**Example Responses:**
"Oof, that stings. What went through your mind when they said that?"
"Your heart must be racing. What's the scariest part about this?"
"That dismissive feeling - where else have you felt that?"
"Sounds overwhelming. What does your gut say you need right now?"

**Context for ${context.yourTraits.name || 'this person'}:**
- Attachment: ${context.yourTraits.attachmentStyle || 'Unknown'}
- Love Languages: ${context.yourTraits.loveLanguages?.join(', ') || 'Unknown'}
- Stress Response: ${context.yourTraits.stressResponse?.join(', ') || 'Unknown'}
- Partner: ${context.partnerTraits.name || 'Unknown'}

NEVER give advice until you've asked at least 3-4 discovery questions. Your job is to understand first, advise later.`;

      const finalPrompt = customPrompt || discoveryPrompt;

      const response = await aiService.generateResponse(
        userMessage,
        finalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Enforce response length limits
      const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 2) {
        // Take first sentence + question if it's too long
        const firstSentence = sentences[0].trim();
        const lastSentence = sentences[sentences.length - 1].trim();
        
        // If last sentence is a question, keep it
        if (lastSentence.includes('?')) {
          return `${firstSentence}. ${lastSentence}?`;
        } else {
          return `${firstSentence}.`;
        }
      }

      // Ensure response ends with question for engagement
      if (!response.includes('?')) {
        const engagingQuestions = [
          "What's that like for you?",
          "How does that feel?",
          "What comes up for you?",
          "What's your take on that?",
          "What's going through your mind?"
        ];
        const randomQuestion = engagingQuestions[Math.floor(Math.random() * engagingQuestions.length)];
        return `${response.replace(/[.!]*$/, '')}. ${randomQuestion}`;
      }

      return response;
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      throw error;
    }
  }
}
