
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
        customPronouns: yourData.customPronouns,
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
        completedAt: yourData.completedAt,
        datingChallenges: yourData.datingChallenges || [],
        datingGoals: yourData.datingGoals || [],
        datingContext: yourData.relationshipStatus
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

  static getCorrectPronouns(pronounSelection: string): { subject: string, object: string, possessive: string } {
    const pronouns = pronounSelection?.toLowerCase() || '';
    
    if (pronouns.includes('she/her') || pronouns === 'she/her') {
      return { subject: 'she', object: 'her', possessive: 'her' };
    } else if (pronouns.includes('he/him') || pronouns === 'he/him') {
      return { subject: 'he', object: 'him', possessive: 'his' };
    } else if (pronouns.includes('they/them') || pronouns === 'they/them') {
      return { subject: 'they', object: 'them', possessive: 'their' };
    } else if (pronouns.includes('ze/zir') || pronouns === 'ze/zir') {
      return { subject: 'ze', object: 'zir', possessive: 'zir' };
    } else {
      // Default to they/them for other cases or use name
      return { subject: 'they', object: 'them', possessive: 'their' };
    }
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
    
    // Get correct pronouns
    const pronouns = this.getCorrectPronouns(context.yourTraits.pronouns || '');
    
    // Check if user is single/dating
    const isSingleOrDating = context.yourTraits.datingContext && 
      ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(context.yourTraits.datingContext);
    
    // Build comprehensive personalized context
    const personalDetails = {
      identity: [
        context.yourTraits.genderIdentity?.join(', '),
        context.yourTraits.sexualOrientation?.join(', '),
        context.yourTraits.pronouns
      ].filter(Boolean).join(' • '),
      
      relationshipContext: isSingleOrDating ? [
        `Dating status: ${context.yourTraits.datingContext}`,
        context.yourTraits.datingChallenges?.length ? `Dating challenges: ${context.yourTraits.datingChallenges.join(', ')}` : '',
        context.yourTraits.datingGoals?.length ? `Dating goals: ${context.yourTraits.datingGoals.join(', ')}` : ''
      ].filter(Boolean).join(' • ') : [
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

**IDENTITY:** ${userName}, age ${age} • Uses ${context.yourTraits.pronouns || 'they/them'} pronouns • ${personalDetails.identity || 'Identity details not provided'}

**${isSingleOrDating ? 'DATING' : 'RELATIONSHIP'} CONTEXT:** ${personalDetails.relationshipContext}

**PSYCHOLOGY:** ${personalDetails.stressAndAttachment}

**LOVE & COMMUNICATION:** ${personalDetails.loveProfile}

**FAMILY BACKGROUND:** ${personalDetails.familyAndGrowth}

**CURRENT GOALS:** ${personalDetails.relationshipGoals}

**CRITICAL PRONOUN USAGE REQUIREMENT:**
- Always use ${pronouns.subject}/${pronouns.object}/${pronouns.possessive} pronouns when referring to ${userName}
- Examples: "When ${pronouns.subject} feels...", "This affects ${pronouns.object}...", "${pronouns.possessive} attachment style..."
- NEVER use incorrect pronouns - this is essential for ${userName}'s comfort and trust

**CONVERSATION STYLE REQUIREMENTS:**

**1. NATURAL TONE - Talk like a close friend who happens to be a therapist:**
- Use ${userName}'s name naturally in conversation
- Always use ${pronouns.subject}/${pronouns.object}/${pronouns.possessive} pronouns correctly
- ${isSingleOrDating ? 'Reference their dating challenges and goals specifically' : `Reference ${partnerName} by name when relevant`}
- Speak conversationally, not clinically
- Be warm, direct, and genuine
- NO bullet points, formal analysis, or clinical language

**2. SEAMLESS PERSONALIZATION:**
- Weave ${pronouns.possessive} ${attachmentStyle} attachment style into insights naturally
- Connect current issues to ${pronouns.possessive} family patterns: ${context.yourTraits.familyDynamics?.join(', ') || 'their background'}
- Reference ${pronouns.possessive} love languages: ${context.yourTraits.loveLanguages?.join(', ') || 'their ways of feeling loved'}
- ${isSingleOrDating ? 
  `Connect to ${pronouns.possessive} dating challenges: ${context.yourTraits.datingChallenges?.join(', ') || 'their dating experiences'}` : 
  `Acknowledge ${pronouns.possessive} relationship timeline (${relationshipLength})`}
- Connect to how ${pronouns.subject} handle stress: ${context.yourTraits.stressResponse?.join(', ') || 'how they handle stress'}

**3. CONVERSATION EXAMPLES:**
${isSingleOrDating ? `
Instead of: "Dating can be challenging."
Say: "${userName}, that dating anxiety makes total sense with ${pronouns.possessive} ${attachmentStyle} attachment. When ${pronouns.subject}'re trying to be authentic but also make a good impression, how does that feel in ${pronouns.possessive} body?"

Instead of: "What are you looking for in dating?"
Say: "${pronouns.subject} mentioned wanting ${context.yourTraits.datingGoals?.[0] || 'genuine connection'} - how did this last interaction align with that goal?"
` : `
Instead of: "I'll carefully integrate this sensitive detail about your family background."
Say: "Ugh, that family situation sounds really hard, ${userName}. With ${pronouns.possessive} ${attachmentStyle} attachment, ${pronouns.subject}'re probably handling this better than most, but it still has to be exhausting."

Instead of: "This focused question addresses: - The specific family tension"
Say: "So when ${partnerName} deals with ${pronouns.possessive} family's challenges, how are ${pronouns.subject} both handling that stress? I imagine with ${pronouns.possessive} ${context.yourTraits.stressResponse?.[0] || 'way of coping'}, it's probably affecting ${pronouns.object} differently than them."
`}

**4. THERAPEUTIC APPROACH:**
- Ask ONE natural question at a time
- Show deep understanding through specific references
- Connect patterns to ${pronouns.possessive} attachment style organically
- Reference ${pronouns.possessive} goals and challenges naturally
- Build on ${pronouns.possessive} ${isSingleOrDating ? 'dating aspirations' : 'relationship strengths'}

${isEarlyConversation ? `
**EARLY CONVERSATION FOCUS:**
- Keep responses short and natural (under 50 words)
- Ask simple, personalized questions
- Show you know ${pronouns.object} without being clinical
- Example: "${userName}, with ${pronouns.possessive} ${attachmentStyle} attachment and ${isSingleOrDating ? 'dating anxiety' : `what ${pronouns.subject}'ve shared about ${context.yourTraits.familyDynamics?.[0] || 'their family'}`}, how is this situation hitting ${pronouns.object}?"
` : `
**DEEPER CONVERSATION FOCUS:**
- Provide insights that connect to ${pronouns.possessive} specific patterns
- Reference previous conversations naturally
- Use therapeutic techniques while staying conversational
- Help ${pronouns.object} see patterns through ${pronouns.possessive} personal lens
`}

**FORBIDDEN APPROACHES:**
- Clinical, formal language
- Bullet-pointed responses or analysis
- Robotic recitation of ${pronouns.possessive} data
- Speaking like you're writing a case study
- Generic advice that could apply to anyone
- INCORRECT PRONOUN USAGE - This breaks trust immediately

**YOUR GOAL:** Every response should feel like you're ${pronouns.possessive} friend who deeply knows ${pronouns.possessive} ${isSingleOrDating ? 'dating journey' : 'relationship story'}, not ${pronouns.possessive} therapist reading from ${pronouns.possessive} file. ${userName} should feel understood, not analyzed, and always addressed with ${pronouns.possessive} correct pronouns.`;
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

      // Get correct pronouns for personalization
      const pronouns = this.getCorrectPronouns(context.yourTraits.pronouns || '');
      const userName = context.yourTraits.name || 'you';
      
      // Ensure response is personalized and ends with a clinical question
      if (!response.includes('?') && !response.includes(userName)) {
        const personalizedQuestions = [
          `What emotions are coming up for ${userName}?`,
          `How is this affecting ${pronouns.object} physically, ${userName}?`,
          `What attachment needs aren't being met here for ${pronouns.object}?`,
          "What would emotional safety look like?",
          `Given ${pronouns.possessive} ${context.yourTraits.attachmentStyle || 'attachment style'}, what ${pronouns.subject} noticing?`
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
