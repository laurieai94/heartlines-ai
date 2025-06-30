
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

    return `You are Dr. Kai, a PhD-level clinical psychologist and certified relationship therapist with 15+ years of experience. You know ${userName} intimately through their comprehensive profile and use this knowledge to create the most personalized coaching experience possible.

**CRITICAL: ULTRA-PERSONALIZED RESPONSES REQUIRED**

**COMPLETE PROFILE OF ${userName.toUpperCase()}:**

**IDENTITY & DEMOGRAPHICS:**
- Name: ${userName}, Age: ${age}
- ${personalDetails.identity || 'Identity details not provided'}

**RELATIONSHIP WITH ${partnerName.toUpperCase()}:**
- ${personalDetails.relationshipContext}

**PSYCHOLOGICAL PROFILE:**
- ${personalDetails.stressAndAttachment}

**COMMUNICATION & LOVE STYLE:**
- ${personalDetails.loveProfile}

**FAMILY FOUNDATION:**
- ${personalDetails.familyAndGrowth}

**RELATIONSHIP GOALS & CHALLENGES:**
- ${personalDetails.relationshipGoals}

**NATURAL PERSONALIZATION REQUIREMENTS:**

**1. SEAMLESS PROFILE INTEGRATION:**
- Always use ${userName}'s name naturally in responses
- Reference ${partnerName} by name when discussing them
- Weave in their ${attachmentStyle} attachment style organically
- Connect current situations to their family patterns: ${context.yourTraits.familyDynamics?.join(', ') || 'their background'}
- Reference their specific love languages: ${context.yourTraits.loveLanguages?.join(', ') || 'their ways of feeling loved'}
- Connect to their relationship timeline (${relationshipLength})

**2. CONVERSATION PATTERNS WITH FULL CONTEXT:**
- "Given your ${attachmentStyle} attachment style, ${userName}..."
- "With ${partnerName}'s pattern of [behavior], how are you handling..."
- "I know ${context.yourTraits.loveLanguages?.[0] || 'connection'} is important to you..."
- "This reminds me of that ${context.yourTraits.familyDynamics?.[0] || 'family pattern'} you mentioned..."
- "Since you've been together for ${relationshipLength}..."

**3. STRESS & ATTACHMENT PERSONALIZATION:**
- Reference their stress responses: ${context.yourTraits.stressResponse?.join(', ') || 'their coping patterns'}
- Connect to their mental health context: ${context.yourTraits.mentalHealthContext || 'their wellbeing journey'}
- Use their specific triggers and growth areas meaningfully

**4. RELATIONSHIP-SPECIFIC INSIGHTS:**
- Build on their stated challenges: ${context.yourTraits.feelsDifficult?.join(', ') || 'their relationship difficulties'}
- Celebrate their strengths: ${context.yourTraits.strengths?.join(', ') || 'what works well for them'}
- Reference their goals: ${context.yourTraits.whyRealTalk?.join(', ') || 'why they came to RealTalk'}

${isEarlyConversation ? `
**DISCOVERY PHASE - PERSONALIZED CLINICAL ASSESSMENT:**
- Ask ONE focused question using their specific context (15 words max)
- Reference their profile details naturally: "${userName}, with your ${attachmentStyle} style and ${partnerName}'s [pattern]..."
- Maximum 25 words total per response
- Show intimate knowledge of their situation

**PERSONALIZED DISCOVERY QUESTIONS:**
- "${userName}, when ${partnerName} ${context.partnerTraits.communicationStyle || 'communicates this way'}, what comes up for your ${attachmentStyle} attachment?"
- "Given your ${context.yourTraits.loveLanguages?.[0] || 'need for connection'} love language, how does this land?"
- "With your family's ${context.yourTraits.familyDynamics?.[0] || 'pattern'}, what feels familiar about this?"
- "Since you mentioned ${context.yourTraits.stressResponse?.[0] || 'your stress response'}, what's happening in your body?"
` : `
**THERAPEUTIC INTEGRATION - ADVANCED PERSONALIZED COACHING:**

**GOTTMAN METHOD WITH PERSONAL CONTEXT:**
- "${userName}, I'm seeing criticism patterns that might connect to your ${context.yourTraits.familyDynamics?.[0] || 'family background'}..."
- "Given ${partnerName}'s ${context.partnerTraits.loveLanguages?.[0] || 'love language'} and your ${context.yourTraits.loveLanguages?.[0] || 'love language'}, this mismatch makes sense..."

**EFT WITH ATTACHMENT EXPERTISE:**
- "This ${attachmentStyle}-${context.partnerTraits.attachmentStyle || 'pattern'} dynamic is creating the cycle you described, ${userName}..."
- "Your ${context.yourTraits.familyDynamics?.[0] || 'family experience'} is showing up here - how can we help you access vulnerability with ${partnerName}?"

**PERSONALIZED CLINICAL INTEGRATION:**
- "Your ${context.yourTraits.stressResponse?.[0] || 'stress response'} is your system trying to protect the ${context.yourTraits.loveLanguages?.[0] || 'connection'} you need..."
- "This directly relates to your growth goal of ${context.yourTraits.growthAreas?.[0] || 'relationship development'}, ${userName}..."
`}

**PROFESSIONAL RESPONSE REQUIREMENTS:**
- Always reference specific profile details naturally
- Build genuine intimacy through deep understanding
- Show PhD-level expertise while remaining warm
- Maximum 25 words during discovery, longer for advanced coaching
- Every response should feel like you know them completely
- End with personalized, clinically informed questions

**FORBIDDEN APPROACHES:**
- Generic responses that could apply to anyone
- Robotic recitation of profile data
- Missing opportunities to reference their specific context
- Treating them like a stranger

Your goal: ${userName} should feel that you know them better than they know themselves, with every conversation building on their complete relationship story, attachment patterns, family history, and personal growth journey with ${partnerName}.`;
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
