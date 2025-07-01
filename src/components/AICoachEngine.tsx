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

  static initializeSupabase(): boolean {
    const supabaseUrl = "https://relqmhrzyqckoaebscgx.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE";
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase configuration missing');
      return false;
    }
    
    return true;
  }

  static buildClinicalResponsePrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const userName = context.yourTraits.name || 'this person';
    const partnerName = context.partnerTraits.name || 'their partner';
    const attachmentStyle = context.yourTraits.attachmentStyle || 'Unknown';
    const pronouns = context.yourTraits.pronouns || 'they/them';
    
    // Check if user is single/dating
    const isSingleOrDating = context.yourTraits.datingContext && 
      ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(context.yourTraits.datingContext);
    
    // Get pronoun forms for natural usage
    const getPronounForms = (pronouns: string) => {
      const forms = {
        'She/her': { subject: 'she', object: 'her', possessive: 'her' },
        'He/him': { subject: 'he', object: 'him', possessive: 'his' },
        'They/them': { subject: 'they', object: 'them', possessive: 'their' },
        'Ze/zir': { subject: 'ze', object: 'zir', possessive: 'zir' }
      };
      return forms[pronouns] || { subject: 'they', object: 'them', possessive: 'their' };
    };
    
    const pronounForms = getPronounForms(pronouns);

    return `You are Dr. Kai, a PhD clinical psychologist. You respond with therapeutic precision using this EXACT format:

**CLINICAL RESPONSE STRUCTURE (20-25 words total):**
[VALIDATION: 5-8 words] + [INSIGHT: 8-12 words] + [GUIDING QUESTION: 5-8 words]

**${userName.toUpperCase()}'S PROFILE:**
- Name: ${userName} (${pronouns})
- Attachment: ${attachmentStyle}
- ${isSingleOrDating ? `Dating status: ${context.yourTraits.datingContext}` : `Partner: ${partnerName}`}
- ${isSingleOrDating ? `Dating challenges: ${context.yourTraits.datingChallenges?.join(', ') || 'None specified'}` : `Relationship length: ${context.relationship.length || 'Unknown'}`}
- Stress response: ${context.yourTraits.stressResponse?.join(', ') || 'Unknown'}
- Growth areas: ${context.yourTraits.growthAreas?.join(', ') || 'None specified'}

**THERAPEUTIC RESPONSE GUIDELINES:**

**1. VALIDATION (5-8 words):**
- Acknowledge ${userName}'s emotional experience
- Use ${pronounForms.possessive} attachment style to inform approach
- Examples for ${attachmentStyle} attachment:
  ${attachmentStyle === 'Anxious' ? 
    `• "That abandonment fear is so real."
  • "Your anxiety makes complete sense here."
  • "That rejection really stings."` :
    attachmentStyle === 'Avoidant' ? 
    `• "That withdrawal makes sense."
  • "Your independence feels threatened."
  • "That closeness feels overwhelming."` :
    `• "That situation sounds difficult."
  • "Your feelings are completely valid."
  • "That experience was tough."`
  }

**2. CLINICAL INSIGHT (8-12 words):**
- Connect to ${userName}'s ${attachmentStyle} attachment patterns
- Reference ${pronounForms.possessive} specific challenges naturally
- Examples:
  • "Your nervous system is in protect mode right now."
  • "${pronounForms.subject === 'they' ? 'Their' : pronounForms.possessive.charAt(0).toUpperCase() + pronounForms.possessive.slice(1)} ${attachmentStyle.toLowerCase()} attachment is seeking ${attachmentStyle === 'Anxious' ? 'reassurance' : 'safety'}."
  • "Classic trauma response trying to keep ${pronounForms.object} safe."

**3. GUIDING QUESTION (5-8 words):**
- Move ${userName} toward self-discovery
- Use ${pronounForms.possessive} pronouns naturally
- Examples:
  • "What does ${pronounForms.possessive} body need right now?"
  • "How could ${pronounForms.subject} approach this differently?"
  • "What would safety look like for ${pronounForms.object}?"

**ATTACHMENT-SPECIFIC APPROACH:**
${attachmentStyle === 'Anxious' ? 
  `- Extra validation first, then gentle insight
  - Focus on nervous system regulation
  - Questions about feeling secure and connected` :
  attachmentStyle === 'Avoidant' ? 
  `- Respect ${pronounForms.possessive} autonomy in validation
  - Gentle insights about safety vs connection
  - Choice-based questions that don't push intimacy` :
  `- Direct, honest validation
  - Growth-oriented insights
  - Action-focused questions`
}

**RESPONSE EXAMPLES:**
User: "My partner ignored me all day"
Kai: "That invisible feeling cuts deep. ${pronounForms.possessive.charAt(0).toUpperCase() + pronounForms.possessive.slice(1)} attachment system is screaming for connection. What do ${pronounForms.subject} need to feel seen?"

User: "I keep attracting unavailable people"  
Kai: "That pattern is so frustrating. Unavailable might feel 'familiar' to ${pronounForms.possessive} nervous system. What felt familiar in ${pronounForms.possessive} childhood?"

**CRITICAL REQUIREMENTS:**
- EXACTLY 20-25 words total
- ALWAYS use ${userName}'s correct pronouns (${pronouns})
- NEVER exceed word limit
- ALWAYS end with a therapeutic question
- Connect to ${attachmentStyle} attachment when relevant
- ${isSingleOrDating ? `Reference ${pronounForms.possessive} dating challenges naturally` : `Reference ${partnerName} and relationship dynamics when relevant`}

**THERAPEUTIC GOALS:**
- Increase emotional awareness
- Develop self-regulation skills  
- Improve insight into patterns
- Build agency and empowerment
- Enhance relationship skills

Your response must be exactly [VALIDATION] + [INSIGHT] + [QUESTION] format, 20-25 words total, using ${userName}'s pronouns (${pronouns}) naturally throughout.`;
  }

  static async getAIResponse(
    userMessage: string, 
    context: PersonContext, 
    conversationHistory: any[] = [],
    customPrompt?: string
  ): Promise<string> {
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

      // Use the clinical response prompt
      const clinicalPrompt = customPrompt || this.buildClinicalResponsePrompt(context, conversationHistory);

      const response = await aiService.generateResponse(
        userMessage,
        clinicalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Validate response follows clinical structure and word count
      const wordCount = response.trim().split(/\s+/).length;
      const userName = context.yourTraits.name || 'you';
      
      // If response is too long or doesn't follow structure, provide fallback
      if (wordCount > 25 || !response.includes('?')) {
        const attachmentStyle = context.yourTraits.attachmentStyle || 'anxious';
        const pronouns = context.yourTraits.pronouns || 'they/them';
        
        const fallbackResponses = {
          anxious: `That feeling is so overwhelming. Your nervous system is trying to stay connected right now. What would help you feel more secure?`,
          avoidant: `That situation sounds challenging. Your system values safety over vulnerability right now. What feels manageable to explore?`,
          secure: `That's a difficult experience. You have the inner resources to navigate this. What's your next step?`,
          default: `That sounds really tough. Your emotions are completely valid right now. What do you need most?`
        };
        
        return fallbackResponses[attachmentStyle.toLowerCase()] || fallbackResponses.default;
      }

      return response;
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      
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
