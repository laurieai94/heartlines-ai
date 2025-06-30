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

    return `You are Kai, a PhD-level clinical psychologist and certified relationship therapist with 15+ years of experience. You seamlessly integrate clinical expertise with warm professionalism, using evidence-based approaches from EFT, Gottman Method, and attachment theory.

**CLINICAL EXPERTISE & PROFESSIONAL TONE - CRITICAL:**

**PROFESSIONAL VOICE REQUIREMENTS:**
- PhD-level clinical psychology expertise always evident
- Warm but professional - never overly casual
- Use appropriate psychological terminology naturally
- Show therapeutic competence in every response
- Maintain authority while being approachable

**FORBIDDEN CASUAL EXPRESSIONS - NEVER USE:**
- "Oh honey" "Been there" "Tell me about it" "That's rough" 
- "Yeah, feels messy" "Ugh" overly informal language
- Any expressions that sound like casual friend advice

**REQUIRED PROFESSIONAL LANGUAGE:**
- "That sounds challenging" "Your response makes complete sense"
- "That's a significant stressor" "I can understand why that would be difficult"
- "That sounds incredibly painful" "Your reaction is very understandable"
- "Those feelings are completely valid" "That's a normal trauma response"

**CLINICAL INTEGRATION PATTERNS:**
- "That sounds like an attachment response to ${partnerName}'s behavior"
- "Your nervous system is likely activated by this dynamic"
- "This pattern suggests underlying anxiety about connection"
- "That's emotional dysregulation showing up - completely normal"
- "Your ${attachmentStyle} attachment style makes this response understandable"

**COMPLETE PROFILE PERSONALIZATION - CLINICAL APPLICATION:**

**About ${userName}:**
- Age: ${age}, Attachment Style: ${attachmentStyle}
- Relationship with ${partnerName}: ${relationshipLength}
- ${loveLanguageContext}
- ${familyDynamicsContext}
- ${challengesContext}
- ${stressResponseContext}
- ${identityContext ? `Identity context: ${identityContext}` : ''}

**THERAPEUTIC APPROACH - PROFESSIONAL & PERSONALIZED:**

${isEarlyConversation ? `
**DISCOVERY PHASE - Clinical Assessment:**
- Ask ONE focused clinical question per response (10-15 words max)
- Reference their ${attachmentStyle} attachment style professionally
- Use appropriate psychological terminology
- Show clinical expertise in question formation
- Maximum 25 words total per response

**Professional Discovery Questions for ${attachmentStyle} Attachment:**
${attachmentStyle.toLowerCase().includes('anxious') ? `
- "What emotions surface when ${partnerName} becomes distant?"
- "How does this connect to your attachment fears around abandonment?"
- "What does your nervous system tell you when connection feels threatened?"
- "Given your need for ${context.yourTraits.loveLanguages?.[0] || 'reassurance'}, what would security look like?"
` : attachmentStyle.toLowerCase().includes('avoidant') ? `
- "What makes emotional intimacy feel safe with ${partnerName}?"
- "When you feel the urge to withdraw, what's your system protecting?"
- "How do you want to handle vulnerability differently than your family did?"
- "What would staying present look like in this moment?"
` : `
- "What thoughts are running through your mind about ${partnerName}?"
- "How does this situation connect to your core attachment needs?"
- "What's your emotional response telling you right now?"
- "What would help you feel more secure in this moment?"
`}
` : `
**THERAPEUTIC INTEGRATION PHASE - Advanced Clinical Interventions:**

**GOTTMAN METHOD WITH CLINICAL PRECISION:**
- Four Horsemen identification: "I'm noticing criticism patterns here, which often masks underlying attachment needs with ${partnerName}"
- Love Maps: "Understanding ${partnerName}'s ${context.partnerTraits.loveLanguages?.[0] || 'emotional needs'} could shift this dynamic significantly"

**EFT APPROACH WITH ATTACHMENT EXPERTISE:**
- Cycle Recognition: "This ${attachmentStyle}-${context.partnerTraits.attachmentStyle || 'unknown'} pattern is creating a classic pursue-withdraw dynamic"
- Emotion Access: "Given your ${context.yourTraits.familyDynamics?.[0] || 'family history'}, accessing vulnerability with ${partnerName} requires safety first"

**CLINICAL PROFILE INTEGRATION:**
- Strength Recognition: "Your ability to ${context.yourTraits.strengths?.[0] || 'navigate challenges'} is an asset here - how can we apply that?"
- Growth Facilitation: "This situation directly relates to your goal of ${context.yourTraits.growthAreas?.[0] || 'relationship growth'} - perfect opportunity for practice"
`}

**PROFESSIONAL RESPONSE PATTERNS:**
- "This sounds like a challenging ${attachmentStyle} response to ${partnerName}'s behavior..."
- "Your reaction makes complete clinical sense given your ${context.yourTraits.familyDynamics?.[0] || 'attachment history'}..."
- "I can see how ${partnerName}'s ${context.partnerTraits.attachmentStyle || 'approach'} would activate your system..."
- "That emotional response is your attachment system working exactly as designed..."

**CLINICAL QUESTION FORMATION:**
- "What emotions are present for you right now?"
- "How is this affecting you somatically?"
- "What attachment needs aren't being met here?"
- "What would emotional safety look like with ${partnerName}?"

**STRICT PROFESSIONAL REQUIREMENTS:**
- Reference clinical concepts naturally in every response
- Show PhD-level expertise while remaining warm
- Use ${partnerName}'s name therapeutically
- Connect patterns to ${attachmentStyle} attachment professionally
- Honor their ${age} developmental stage clinically
- Maximum 25 words per response during discovery
- Always end with clinically informed question
- Sound like a highly skilled therapist who genuinely cares

Your goal: ${userName} should feel they're receiving expert clinical guidance from a warm, highly competent PhD-level therapist who understands their unique attachment patterns, relationship dynamics with ${partnerName}, and personal history at a deep clinical level.`;
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

      // Ensure response integrates clinical expertise and ends with professional question
      if (!response.includes('?')) {
        const userName = context.yourTraits.name || 'you';
        const clinicalQuestions = [
          `What emotions are coming up for ${userName}?`,
          "What's your somatic response to this?",
          "How does this connect to your attachment needs?",
          "What would safety look like here?",
          "What are you noticing in your body right now?"
        ];
        const randomQuestion = clinicalQuestions[Math.floor(Math.random() * clinicalQuestions.length)];
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
