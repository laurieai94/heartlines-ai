import { AIService } from "@/services/aiService";
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    const yourProfile = profiles.your[0] || {};
    const partnerProfile = profiles.partner[0] || {};
    const yourDemo = demographicsData.your || {};
    const partnerDemo = demographicsData.partner || {};

    // Merge profile and demographics data completely
    const yourData = { ...yourProfile, ...yourDemo };
    const partnerData = { ...partnerProfile, ...partnerDemo };

    return {
      relationship: {
        length: yourData.relationshipLength || yourData.relationshipStatus,
        livingTogether: yourData.livingTogether,
        stage: yourData.relationshipStage,
        emotionalConnection: yourData.emotionalConnection,
        livingArrangement: yourData.livingArrangement,
        relationshipType: yourData.relationshipType
      },
      yourTraits: {
        name: yourData.name,
        age: yourData.age,
        pronouns: yourData.pronouns || yourData.customPronouns,
        loveLanguages: yourData.loveLanguages || yourData.feelLovedWhen || [],
        communicationStyle: yourData.communicationStyle || yourData.communicationDirectness,
        conflictStyle: yourData.conflictStyle || yourData.conflictNeeds,
        stressResponse: yourData.stressResponse || yourData.stressReactions || [],
        attachmentStyle: yourData.attachmentStyle || yourData.attachmentStyles,
        triggers: yourData.triggers || [],
        strengths: yourData.strengths || yourData.workingWell || yourData.relationshipPositives || [],
        growthAreas: yourData.growthAreas || yourData.biggestChallenge || yourData.relationshipChallenges || [],
        familyDynamics: yourData.familyDynamics || [],
        whyRealTalk: yourData.whyRealTalk || yourData.motivations || [],
        mentalHealthContext: yourData.mentalHealthContext,
        education: yourData.education,
        workSituation: yourData.workSituation,
        sexualOrientation: yourData.sexualOrientation || yourData.orientation || [],
        genderIdentity: yourData.genderIdentity || yourData.gender || [],
        parentConflictStyle: yourData.parentConflictStyle || [],
        loveMessages: yourData.loveMessages || [],
        loveInfluences: yourData.loveInfluences || yourData.relationshipInfluences || [],
        relationshipLength: yourData.relationshipLength,
        feelsDifficult: yourData.feelsDifficult || [],
        hopingFor: yourData.hopingFor || [],
        readiness: yourData.readiness || [],
        healthyRelationship: yourData.healthyRelationship || [],
        additionalInfo: yourData.additionalInfo,
        profileComplete: yourData.profileComplete,
        completedAt: yourData.completedAt
      },
      partnerTraits: {
        name: partnerData.name || yourData.partnerName,
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

  static buildUltraPersonalizedPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const conversationCount = conversationHistory.length;
    const isEarlyConversation = conversationCount < 8;
    
    const userName = context.yourTraits.name || 'this person';
    const partnerName = context.partnerTraits.name || 'their partner';
    const attachmentStyle = context.yourTraits.attachmentStyle || 'Unknown';
    const relationshipLength = context.relationship.length || context.yourTraits.relationshipLength || 'Unknown';
    const age = context.yourTraits.age || 'Unknown';
    
    // Build comprehensive personalized context
    const personalDetails = {
      identity: [
        context.yourTraits.genderIdentity?.join(', '),
        context.yourTraits.sexualOrientation?.join(', '),
        context.yourTraits.pronouns
      ].filter(Boolean).join(' • '),
      
      relationshipContext: [
        `Together for: ${relationshipLength}`,
        context.relationship.livingTogether ? 'Living together' : 'Not living together',
        context.relationship.emotionalConnection ? `Connection level: ${context.relationship.emotionalConnection}` : '',
        context.relationship.livingArrangement ? `Living: ${context.relationship.livingArrangement}` : ''
      ].filter(Boolean).join(' • '),
      
      loveProfile: [
        context.yourTraits.loveLanguages?.length ? `Love languages: ${context.yourTraits.loveLanguages.join(', ')}` : '',
        context.yourTraits.communicationStyle ? `Communication: ${context.yourTraits.communicationStyle}` : '',
        context.yourTraits.conflictStyle ? `Conflict style: ${context.yourTraits.conflictStyle}` : ''
      ].filter(Boolean).join(' • '),
      
      stressAndAttachment: [
        `Attachment: ${attachmentStyle}`,
        context.yourTraits.stressResponse?.length ? `Stress response: ${context.yourTraits.stressResponse.join(', ')}` : '',
        context.yourTraits.mentalHealthContext ? `Mental health: ${context.yourTraits.mentalHealthContext}` : ''
      ].filter(Boolean).join(' • '),
      
      familyAndGrowth: [
        context.yourTraits.familyDynamics?.length ? `Family: ${context.yourTraits.familyDynamics.join(', ')}` : '',
        context.yourTraits.parentConflictStyle?.length ? `Parents' conflict: ${context.yourTraits.parentConflictStyle.join(', ')}` : '',
        context.yourTraits.growthAreas?.length ? `Growth goals: ${context.yourTraits.growthAreas.join(', ')}` : ''
      ].filter(Boolean).join(' • '),
      
      relationshipGoals: [
        context.yourTraits.whyRealTalk?.length ? `Seeking help with: ${context.yourTraits.whyRealTalk.join(', ')}` : '',
        context.yourTraits.strengths?.length ? `Relationship strengths: ${context.yourTraits.strengths.join(', ')}` : '',
        context.yourTraits.feelsDifficult?.length ? `Challenges: ${context.yourTraits.feelsDifficult.join(', ')}` : ''
      ].filter(Boolean).join(' • ')
    };

    return `You are Dr. Kai, a warm, direct relationship therapist who talks like a trusted friend. You know ${userName} deeply and speak to them naturally, weaving their personal details into conversation organically.

**${userName.toUpperCase()}'S COMPLETE PROFILE:**

**IDENTITY:** ${userName}, age ${age} • ${personalDetails.identity || 'Identity details not provided'}

**RELATIONSHIP:** ${personalDetails.relationshipContext}

**PSYCHOLOGY:** ${personalDetails.stressAndAttachment}

**LOVE & COMMUNICATION:** ${personalDetails.loveProfile}

**FAMILY BACKGROUND:** ${personalDetails.familyAndGrowth}

**CURRENT GOALS:** ${personalDetails.relationshipGoals}

**CONVERSATION STYLE REQUIREMENTS:**

**1. NATURAL TONE - Talk like a close friend who happens to be a therapist:**
- Use ${userName}'s name naturally in conversation
- Reference ${partnerName} by name when relevant
- Speak conversationally, not clinically
- Be warm, direct, and genuine
- NO bullet points, formal analysis, or clinical language

**2. SEAMLESS PERSONALIZATION:**
- Weave their ${attachmentStyle} attachment style into insights naturally
- Connect current issues to their family patterns: ${context.yourTraits.familyDynamics?.join(', ') || 'their background'}
- Reference their love languages: ${context.yourTraits.loveLanguages?.join(', ') || 'their ways of feeling loved'}
- Acknowledge their relationship timeline (${relationshipLength})
- Connect to their stress responses: ${context.yourTraits.stressResponse?.join(', ') || 'how they handle stress'}

**3. CONVERSATION EXAMPLES:**
Instead of: "I'll carefully integrate this sensitive detail about your family background."
Say: "Ugh, that family situation sounds really hard, ${userName}. With your secure attachment, you're probably handling this better than most, but it still has to be exhausting."

Instead of: "This focused question addresses: - The specific family tension"
Say: "So when ${partnerName} deals with your family's homophobia, how are you both handling that stress? I imagine with your ${context.yourTraits.stressResponse?.[0] || 'way of coping'}, it's probably affecting you differently than them."

**4. THERAPEUTIC APPROACH:**
- Ask ONE natural question at a time
- Show deep understanding through specific references
- Connect patterns to their attachment style organically
- Reference their goals and challenges naturally
- Build on their relationship strengths

${isEarlyConversation ? `
**EARLY CONVERSATION FOCUS:**
- Keep responses short and natural (under 50 words)
- Ask simple, personalized questions
- Show you know them without being clinical
- Example: "${userName}, with your ${attachmentStyle} attachment and what you've shared about ${context.yourTraits.familyDynamics?.[0] || 'your family'}, how is this situation hitting you?"
` : `
**DEEPER CONVERSATION FOCUS:**
- Provide insights that connect to their specific patterns
- Reference previous conversations naturally
- Use therapeutic techniques while staying conversational
- Help them see patterns through their personal lens
`}

**FORBIDDEN APPROACHES:**
- Clinical, formal language
- Bullet-pointed responses or analysis
- Robotic recitation of their data
- Speaking like you're writing a case study
- Generic advice that could apply to anyone

**YOUR GOAL:** Every response should feel like you're their friend who deeply knows their story, not their therapist reading from their file. ${userName} should feel understood, not analyzed.`;
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

      // Use the ultra-personalized prompt
      const finalPrompt = customPrompt || this.buildUltraPersonalizedPrompt(context, conversationHistory);

      const response = await aiService.generateResponse(
        userMessage,
        finalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Ensure response is personalized and ends with a clinical question
      const userName = context.yourTraits.name || 'you';
      if (!response.includes('?') && !response.includes(userName)) {
        const personalizedQuestions = [
          `What emotions are coming up for ${userName}?`,
          `How is this affecting you physically, ${userName}?`,
          `What attachment needs aren't being met here?`,
          "What would emotional safety look like?",
          `Given your ${context.yourTraits.attachmentStyle || 'attachment style'}, what are you noticing?`
        ];
        const randomQuestion = personalizedQuestions[Math.floor(Math.random() * personalizedQuestions.length)];
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
