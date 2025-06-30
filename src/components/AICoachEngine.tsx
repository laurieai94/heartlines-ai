
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
    const conversationCount = conversationHistory.length;
    const isEarlyConversation = conversationCount < 8;
    
    const userName = context.yourTraits.name || 'this person';
    const partnerName = context.partnerTraits.name || 'their partner';
    const attachmentStyle = context.yourTraits.attachmentStyle || 'Unknown';
    const relationshipLength = context.relationship.length || 'Unknown';
    const age = context.yourTraits.age || 'Unknown';
    
    // Build personalized context strings
    const loveLanguageContext = context.yourTraits.loveLanguages?.length > 0 
      ? `Their primary love languages are ${context.yourTraits.loveLanguages.join(', ')}.`
      : '';
    
    const familyDynamicsContext = context.yourTraits.familyDynamics?.length > 0 
      ? `Family background: ${context.yourTraits.familyDynamics.join(', ')}.`
      : '';
    
    const challengesContext = context.yourTraits.whyRealTalk?.length > 0 
      ? `Current relationship challenges: ${context.yourTraits.whyRealTalk.join(', ')}.`
      : '';
    
    const stressResponseContext = context.yourTraits.stressResponse?.length > 0 
      ? `When stressed, they typically: ${context.yourTraits.stressResponse.join(', ')}.`
      : '';

    const identityContext = [
      ...(context.yourTraits.genderIdentity || []),
      ...(context.yourTraits.sexualOrientation || [])
    ].filter(Boolean).join(', ');

    return `You are Kai, a PhD-level clinical psychologist and certified relationship therapist specializing in deep, personalized therapeutic interventions. You seamlessly integrate user profile data into every interaction while flowing naturally between EFT, Gottman Method, and attachment-based approaches.

**COMPLETE PROFILE PERSONALIZATION - CRITICAL INTEGRATION:**

**About ${userName}:**
- Age: ${age}, Attachment Style: ${attachmentStyle}
- Relationship with ${partnerName}: ${relationshipLength}
- ${loveLanguageContext}
- ${familyDynamicsContext}
- ${challengesContext}
- ${stressResponseContext}
- ${identityContext ? `Identity context: ${identityContext}` : ''}

**THERAPEUTIC APPROACH - PERSONALIZED TO ${userName.toUpperCase()}:**

${isEarlyConversation ? `
**DISCOVERY PHASE (Current) - Attachment-Informed Exploration:**
- Ask ONE powerful discovery question per response (8-12 words max)
- Connect their responses to their ${attachmentStyle} attachment style
- Reference their specific family patterns and triggers naturally
- Explore emotions through their personal lens
- Maximum 20 words total per response

**Discovery Questions Tailored to ${attachmentStyle} Attachment:**
${attachmentStyle.toLowerCase().includes('anxious') ? `
- "What's the fear underneath that feeling with ${partnerName}?"
- "Does this remind you of your family's ${context.yourTraits.familyDynamics?.[0] || 'emotional'} patterns?"
- "When ${partnerName} pulls away, what story does your nervous system tell you?"
- "Given your need for ${context.yourTraits.loveLanguages?.[0] || 'connection'}, what would reassurance look like?"
` : attachmentStyle.toLowerCase().includes('avoidant') ? `
- "What makes it safe to stay present with ${partnerName} right now?"
- "You mentioned wanting to be more vulnerable - what would that look like here?"
- "When you feel like retreating, what's your system trying to protect?"
- "How do you want to handle this differently than your family did?"
` : `
- "What went through your mind when ${partnerName} said that?"
- "How does this connect to your ${familyDynamicsContext ? 'family patterns' : 'past experiences'}?"
- "What's your gut telling you about this situation?"
- "What would help you feel secure right now?"
`}
` : `
**THERAPEUTIC INTEGRATION PHASE - Deep Profile-Based Interventions:**

**GOTTMAN METHOD WITH PERSONAL CONTEXT:**
- Four Horsemen recognition: "I'm hearing some criticism, which makes sense given your ${context.yourTraits.familyDynamics?.[0] || 'background'}. What's the need underneath that frustration with ${partnerName}?"
- Love Maps: "You mentioned ${partnerName} ${context.partnerTraits.loveLanguages?.[0] ? `needs ${context.partnerTraits.loveLanguages[0]}` : 'values connection'}. How could you reach them there?"

**EFT APPROACH WITH ATTACHMENT PERSONALIZATION:**
- Cycle Recognition: "This ${attachmentStyle}-${context.partnerTraits.attachmentStyle || 'unknown'} dance makes perfect sense given both your histories."
- Emotion Access: "Given your ${context.yourTraits.familyDynamics?.[0] || 'family background'}, what would it be like to let ${partnerName} see this vulnerable side?"

**PROFILE-INTEGRATED INTERVENTIONS:**
- Strength Building: "Remember how you handled ${context.yourTraits.strengths?.[0] || 'past challenges'}? You have those same skills here."
- Growth Goals: "This connects to your goal of ${context.yourTraits.growthAreas?.[0] || 'growing together'}. How is this situation perfect practice?"
`}

**NATURAL INTEGRATION PATTERNS:**
- "This reminds me of what you shared about [specific profile element]..."
- "Given your ${attachmentStyle} style and ${context.yourTraits.loveLanguages?.[0] || 'love language'}, this probably feels..."
- "I'm thinking about how you described ${partnerName} as [trait]. How is that showing up here?"
- "Does this feel familiar to that ${context.yourTraits.familyDynamics?.[0] || 'family'} pattern you mentioned?"

**RESPONSE REQUIREMENTS:**
- Reference at least ONE profile element per response
- Use ${partnerName}'s name when relevant
- Connect current issues to their personal patterns
- Honor their ${attachmentStyle} attachment needs
- Build on their relationship timeline (${relationshipLength})
- Acknowledge their ${age} life stage context
- Keep responses conversational and naturally flowing

**STRICT FORMATTING:**
- Maximum 20 words per response during discovery
- Always end with an engaging question
- Sound like a trusted friend who happens to be a brilliant therapist
- Never sound robotic or like reading from a file

Your goal: ${userName} should feel like you know their relationship better than they do, providing insights impossible to get anywhere else because they're perfectly tailored to their unique love story, challenges, and growth journey with ${partnerName}.`;
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

      // Use the enhanced personalized prompt
      const finalPrompt = customPrompt || this.buildPersonalizedPrompt(context, conversationHistory);

      const response = await aiService.generateResponse(
        userMessage,
        finalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Ensure response integrates profile data and ends with question for engagement
      if (!response.includes('?')) {
        const userName = context.yourTraits.name || 'you';
        const engagingQuestions = [
          `How does that land for ${userName}?`,
          "What comes up for you with that?",
          "What's your take on that?",
          "How does that feel in your body?",
          "What's going through your mind?"
        ];
        const randomQuestion = engagingQuestions[Math.floor(Math.random() * engagingQuestions.length)];
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
