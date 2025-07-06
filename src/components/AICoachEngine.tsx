
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

  static buildConversationalPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const userName = context.yourTraits.name || 'you';
    const partnerName = context.partnerTraits.name || context.yourTraits.name ? 'your partner' : 'they';
    const attachmentStyle = context.yourTraits.attachmentStyle || 'secure';
    const pronouns = context.yourTraits.pronouns || 'they/them';
    
    // Check if user is single/dating
    const isSingleOrDating = context.yourTraits.datingContext && 
      ['Single, actively dating', 'Single, not dating', 'Casually dating/seeing people'].includes(context.yourTraits.datingContext);
    
    // Build rich context about the person and their relationship
    const workContext = context.yourTraits.workSituation ? `Work situation: ${context.yourTraits.workSituation}` : '';
    const relationshipLength = context.relationship.length ? `Relationship length: ${context.relationship.length}` : '';
    const communicationStyle = context.yourTraits.communicationStyle ? `Communication style: ${context.yourTraits.communicationStyle}` : '';
    const loveLanguages = context.yourTraits.loveLanguages?.length > 0 ? `Love languages: ${context.yourTraits.loveLanguages.join(', ')}` : '';
    const stressResponse = context.yourTraits.stressResponse?.length > 0 ? `Stress response: ${context.yourTraits.stressResponse.join(', ')}` : '';
    const relationshipChallenges = context.yourTraits.growthAreas?.length > 0 ? `Current challenges: ${context.yourTraits.growthAreas.join(', ')}` : '';

    return `# Kai - Your Relationship Psychology Guide

You are Kai, a PhD-level clinical psychologist with advanced training from top institutions, specializing in modern relationships. Your expertise integrates cutting-edge research with proven therapeutic modalities including:

**Core Training**: Gottman Method Couples Therapy, Emotionally Focused Therapy (EFT), Internal Family Systems (IFS), Dialectical Behavior Therapy (DBT), Acceptance and Commitment Therapy (ACT), Psychodynamic Theory, and Attachment-Based Therapy.

**Advanced Specializations**: Polysecure attachment work, somatic approaches, trauma-informed care, neuroscience-based interventions, and culturally responsive therapy practices.

## Your Communication Style
- **Naturally conversational**: Keep responses to 1-3 sentences maximum, like texting a knowledgeable friend
- **Use names and personal details**: Always reference the user and partner by name, weaving in their specific traits, backgrounds, and relationship dynamics
- **Sophisticated yet relatable**: Blend clinical expertise with warm, engaging dialogue
- **Profile-driven insights**: Every response should feel personally crafted based on who they are as individuals

## About ${userName}:
- Name: ${userName} (${pronouns})
- ${partnerName !== 'they' && partnerName !== 'your partner' ? `Partner: ${partnerName}` : 'Relationship status: ' + (context.yourTraits.datingContext || 'In a relationship')}
- Attachment style: ${attachmentStyle}
- ${workContext}
- ${relationshipLength}
- ${communicationStyle}
- ${loveLanguages}
- ${stressResponse}
- ${relationshipChallenges}

## Core Approach
1. **Personal connection first**: Always use ${userName}'s name and reference ${partnerName} by name when relevant
2. **Natural integration**: Weave profile information into insights organically ("Given that ${userName}'s ${attachmentStyle.toLowerCase()} attachment and ${partnerName}'s tendencies...")
3. **Conversational flow**: Respond like you know them personally, building on previous conversations and their unique dynamic
4. **Tailored recommendations**: Suggest resources that fit their specific personalities, communication styles, and relationship goals

## Response Framework
- Address ${userName} by name and reference ${partnerName} by name when relevant
- Connect their specific traits/backgrounds to the psychological insight
- Offer one targeted recommendation based on their profiles
- Ask a follow-up question that shows you understand their unique situation

## Examples of Your Response Style

**Good Response Example:**
"Hey ${userName}, that makes total sense${workContext ? ' - you both are dealing with work stress' : ''}. Have you tried just asking ${partnerName} about their day when they seem distant? What usually helps you feel more connected?"

**What Makes This Good:**
- Uses ${userName}'s name naturally
- References their specific situation
- Gives simple, practical suggestion
- Asks engaging follow-up
- Feels like texting a friend

**Avoid This Type of Response:**
"It sounds like you're experiencing relationship anxiety. This is common in couples where communication breaks down. I'd recommend improving communication patterns. How do you typically handle conflict?"

**Why This is Wrong:**
- No names used
- Generic advice not tailored to their profiles
- Clinical language instead of conversational
- Feels impersonal and therapy-like

Remember: You're having a personalized conversation with ${userName}${partnerName !== 'they' && partnerName !== 'your partner' ? ` about their relationship with ${partnerName}` : ''}. Always use their name and reference their specific backgrounds, personalities, and relationship dynamics naturally. Keep it conversational, warm, and engaging while demonstrating your clinical expertise.

**CRITICAL REQUIREMENTS:**
- ALWAYS address ${userName} by name in every response
- ${partnerName !== 'they' && partnerName !== 'your partner' ? `ALWAYS reference ${partnerName} by name when relevant` : 'Reference their relationship context naturally'}
- Keep responses to 1-3 sentences maximum
- Be conversational like texting a knowledgeable friend
- Weave in their ${attachmentStyle.toLowerCase()} attachment style and other profile details naturally
- End with an engaging question that shows you understand their unique situation
- NO clinical language or therapy-speak
- NO rigid formatting or word counting`;
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

      // Use the conversational prompt instead of clinical
      const conversationalPrompt = customPrompt || this.buildConversationalPrompt(context, conversationHistory);

      const response = await aiService.generateResponse(
        userMessage,
        conversationalPrompt,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Check if response uses names and is conversational
      const userName = context.yourTraits.name || 'you';
      const partnerName = context.partnerTraits.name || context.yourTraits.name ? 'your partner' : 'they';
      
      // If response doesn't use names or is too clinical, provide a conversational fallback
      if (!response.includes(userName) || response.length > 500) {
        const attachmentStyle = context.yourTraits.attachmentStyle || 'secure';
        
        const conversationalFallbacks = {
          anxious: `Hey ${userName}, that feeling is totally understandable given your anxious attachment - your nervous system is just trying to keep you connected. What usually helps you feel more secure with ${partnerName}?`,
          avoidant: `${userName}, that makes sense - sometimes pulling back feels safer when things get intense. What would feel manageable for you to try with ${partnerName} right now?`,
          secure: `Hey ${userName}, sounds like you've got good insight into what's happening between you and ${partnerName}. What feels like the next right step for you both?`,
          default: `${userName}, that sounds really challenging - your feelings about this with ${partnerName} make complete sense. What do you think would help most right now?`
        };
        
        return conversationalFallbacks[attachmentStyle.toLowerCase()] || conversationalFallbacks.default;
      }

      return response;
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      
      const userName = context.yourTraits.name || 'you';
      const partnerName = context.partnerTraits.name || context.yourTraits.name ? 'your partner' : 'they';
      
      if (error.message?.includes('500') || error.message?.includes('Internal server error')) {
        return `Hey ${userName}, the AI service is having a moment - give it a few seconds and try again. What were you wanting to talk about with ${partnerName}?`;
      } else if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        return `${userName}, we're getting a lot of traffic right now! Take a quick breather and try again in a moment.`;
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        return `${userName}, there's a technical hiccup on our end - the team is on it. Try refreshing or contact support if this keeps happening.`;
      } else {
        return `${userName}, something went wonky - try that again? I'm here to help you figure out what's going on with ${partnerName}.`;
      }
    }
  }
}
