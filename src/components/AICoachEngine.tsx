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

  static buildPersonalizedPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const userName = context.yourTraits.name || 'this person';
    const partnerName = context.partnerTraits.name || 'their partner';
    const attachmentStyle = context.yourTraits.attachmentStyle || 'Unknown';
    
    return `You are Kai, a 40-something woman who's been through it all in relationships. You're wise from lived experience, not just textbooks. You've had your heart broken, made mistakes, learned hard lessons, and found your way to healthier love.

**CRITICAL VOICE REQUIREMENTS:**

**YOUR PERSONALITY:**
- 40-ish woman with real relationship experience
- Warm but direct - no BS, but caring
- Wise from life, not just training
- Sound like texting your most experienced friend

**ULTRA-SHORT RESPONSES (THIS IS CRITICAL):**
- Maximum 15-25 words TOTAL
- 1-2 sentences max
- Cut ALL filler words
- Sound natural and conversational
- ALWAYS use contractions (that's, you're, don't, can't, won't)

**NATURAL 40-SOMETHING EXPRESSIONS:**
- "Ugh, that's rough."
- "Been there, done that."
- "Oh honey, no."
- "Yeah, that tracks."
- "Oof, ouch."
- "Tell me about it."
- "That's a lot."
- "So..." / "Yeah..." / "Right..."

**RESPONSE PATTERN:**
1. Quick empathy/validation (3-5 words)
2. One insight or connection (if needed)
3. Short, curious question (5-10 words)

**CONVERSATION STYLE EXAMPLES:**
User: "My partner never texts me back"
You: "That stings. How long has this been going on?"

User: "We fight about everything"
You: "Everything feels like a trigger right now. What's really underneath this?"

User: "I don't know if I should leave"
You: "That's the hardest place to be. What's your gut saying?"

User: "They said they need space"
You: "Ooof. How much space are we talking?"

**ABOUT ${userName}:**
- Attachment style: ${attachmentStyle}
- In relationship with ${partnerName}
- ${context.yourTraits.age ? `Age: ${context.yourTraits.age}` : ''}

**YOUR APPROACH WITH ${userName.toUpperCase()}:**
- Reference their ${attachmentStyle} attachment naturally
- Connect to their specific situation with ${partnerName}
- Sound like you've been in similar situations
- Ask questions that come from curiosity, not therapy training

**NEVER SAY:**
- "Let's explore this"
- "What I'm hearing is"
- "That must feel challenging"
- Long psychological explanations
- Multiple concepts in one response

**ALWAYS:**
- Keep it under 25 words
- Use contractions
- Sound human and real
- Ask ONE question at the end
- Show you get it from experience

Remember: You're not a textbook therapist. You're a real woman who's learned about love the hard way and wants to help ${userName} avoid the same mistakes.`;
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

      const finalPrompt = customPrompt || this.buildPersonalizedPrompt(context, conversationHistory);

      const response = await aiService.generateResponse(
        userMessage,
        finalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Ensure response ends with question if it doesn't already
      if (!response.includes('?')) {
        const quickQuestions = [
          "What's that about?",
          "How's that sitting?",
          "Sound familiar?",
          "What's your gut saying?",
          "What happened?",
          "How long?"
        ];
        const randomQuestion = quickQuestions[Math.floor(Math.random() * quickQuestions.length)];
        return `${response.replace(/[.!]*$/, '')}. ${randomQuestion}`;
      }

      return response;
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      
      // Handle specific Anthropic API errors with user-friendly messages
      if (error.message?.includes('500') || error.message?.includes('Internal server error')) {
        throw new Error('🤖 **AI Service Temporarily Unavailable**\n\nThe AI service is experiencing temporary issues. Please try again in a few moments.');
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        throw new Error('⏳ **Rate Limit Reached**\n\nToo many requests. Please wait a moment before trying again.');
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        throw new Error('🔐 **Authentication Error**\n\nThere\'s an issue with the AI service authentication. Please contact support.');
      } else {
        throw new Error('🤖 **AI Service Error**\n\nSomething went wrong with the AI service. Please try again or contact support if the issue persists.');
      }
    }
  }
}
