
import { PersonContext, ChatMessage } from "@/types/AIInsights";
import { AIService } from "@/services/aiService";

export class AICoachEngine {
  private static aiService: AIService | null = null;

  static setSupabaseConfig(supabaseUrl: string, supabaseAnonKey: string) {
    this.aiService = new AIService({ supabaseUrl, supabaseAnonKey });
    console.log('AI Service configured for Supabase backend');
  }

  static initializeSupabase() {
    const supabaseUrl = "https://relqmhrzyqckoaebscgx.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbHFtaHJ6eXFja29hZWJzY2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDg2MTksImV4cCI6MjA2NTYyNDYxOX0.-cE7meF7mvu6uMQ0iA3PkNCu7TX341fryEumWUn4FOE";
    
    console.log('Using hardcoded Supabase configuration');
    
    this.setSupabaseConfig(supabaseUrl, supabaseAnonKey);
    return true;
  }

  static buildPersonContext(profiles: any, demographicsData: any): PersonContext {
    console.log('=== AICoachEngine.buildPersonContext ===');
    console.log('Input profiles:', profiles);
    console.log('Input demographicsData:', demographicsData);
    
    const yourProfile = profiles?.your?.[0] || {};
    const partnerProfile = profiles?.partner?.[0] || {};
    const yourDemographics = demographicsData?.your || {};
    const partnerDemographics = demographicsData?.partner || {};

    console.log('=== Extracted Data ===');
    console.log('yourProfile:', yourProfile);
    console.log('partnerProfile:', partnerProfile);
    console.log('yourDemographics:', yourDemographics);
    console.log('partnerDemographics:', partnerDemographics);

    const extractArrayValue = (value: any): string[] => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
    };

    const extractSingleValue = (value: any): string | undefined => {
      if (Array.isArray(value)) return value[0];
      if (typeof value === 'string') return value;
      return undefined;
    };

    const context: PersonContext = {
      relationship: {
        length: yourProfile.relationshipLength || yourDemographics.relationshipLength || undefined,
        livingTogether: yourDemographics.livingTogether || yourProfile.livingTogether || false,
        stage: yourProfile.relationshipStatus || yourDemographics.relationshipStatus || undefined
      },
      yourTraits: {
        name: yourDemographics.name || yourProfile.name || undefined,
        age: yourDemographics.age || yourProfile.age || undefined,
        pronouns: yourDemographics.pronouns || yourProfile.pronouns || undefined,
        loveLanguages: extractArrayValue(yourProfile.loveLanguages || yourDemographics.loveLanguages || yourProfile.feelLovedWhen),
        communicationStyle: extractSingleValue(yourProfile.communicationStyle || yourDemographics.communicationStyle),
        conflictStyle: extractSingleValue(yourProfile.conflictStyle || yourDemographics.conflictStyle),
        stressResponse: extractArrayValue(yourProfile.stressResponse || yourDemographics.stressResponse),
        attachmentStyle: extractSingleValue(yourProfile.attachmentStyle || yourDemographics.attachmentStyle),
        triggers: extractArrayValue(yourProfile.triggers || yourDemographics.triggers || yourProfile.feelsDifficult),
        strengths: extractArrayValue(yourProfile.strengths || yourDemographics.strengths || yourProfile.workingWell),
        growthAreas: extractArrayValue(yourProfile.growthAreas || yourDemographics.growthAreas || yourProfile.biggestChallenge),
        familyDynamics: extractArrayValue(yourProfile.familyDynamics || yourDemographics.familyDynamics),
        whyRealTalk: extractArrayValue(yourProfile.whyRealTalk || yourDemographics.whyRealTalk),
        mentalHealthContext: yourProfile.mentalHealthContext || yourDemographics.mentalHealthContext,
        education: yourProfile.education || yourDemographics.education,
        workSituation: yourProfile.workSituation || yourDemographics.workSituation,
        sexualOrientation: extractArrayValue(yourProfile.sexualOrientation || yourDemographics.sexualOrientation || yourProfile.orientation),
        genderIdentity: extractArrayValue(yourProfile.genderIdentity || yourDemographics.genderIdentity || yourProfile.gender)
      },
      partnerTraits: {
        name: partnerDemographics.name || partnerProfile.name || undefined,
        loveLanguages: extractArrayValue(partnerProfile.loveLanguages || partnerDemographics.loveLanguages),
        communicationStyle: extractSingleValue(partnerProfile.communicationStyle || partnerDemographics.communicationStyle),
        conflictStyle: extractSingleValue(partnerProfile.conflictStyle || partnerDemographics.conflictStyle),
        stressResponse: extractArrayValue(partnerProfile.stressResponse || partnerDemographics.stressResponse),
        attachmentStyle: extractSingleValue(partnerProfile.attachmentStyle || partnerDemographics.attachmentStyle),
        triggers: extractArrayValue(partnerProfile.triggers || partnerDemographics.triggers),
        strengths: extractArrayValue(partnerProfile.strengths || partnerDemographics.strengths),
        growthAreas: extractArrayValue(partnerProfile.growthAreas || partnerDemographics.growthAreas)
      },
      dynamics: {
        loveLanguageMatch: false,
        loveLanguageGap: false,
        communicationMatch: false,
        conflictDynamic: undefined
      }
    };

    // Calculate dynamics
    const yourLoveLanguages = context.yourTraits.loveLanguages || [];
    const partnerLoveLanguages = context.partnerTraits.loveLanguages || [];
    
    if (yourLoveLanguages.length > 0 && partnerLoveLanguages.length > 0) {
      const hasCommonLoveLanguage = yourLoveLanguages.some(lang => partnerLoveLanguages.includes(lang));
      context.dynamics.loveLanguageMatch = hasCommonLoveLanguage;
      context.dynamics.loveLanguageGap = !hasCommonLoveLanguage;
    }

    if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
      context.dynamics.communicationMatch = context.yourTraits.communicationStyle === context.partnerTraits.communicationStyle;
    }

    if (context.yourTraits.conflictStyle && context.partnerTraits.conflictStyle) {
      context.dynamics.conflictDynamic = `${context.yourTraits.conflictStyle}-${context.partnerTraits.conflictStyle}`;
    }

    console.log('=== Final Context Built ===');
    console.log('context:', context);
    console.log('Has user name:', !!context.yourTraits.name);
    console.log('Has user data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length);
    
    return context;
  }

  static async getAIResponse(userMessage: string, context: PersonContext, chatHistory: ChatMessage[] = [], enhancedPrompt?: string): Promise<string> {
    console.log('=== Getting AI Response ===');
    console.log('User message:', userMessage);
    console.log('Context being used:', context);
    console.log('User name from context:', context.yourTraits.name);
    console.log('User has profile data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length > 1);

    // Debug command - check for various forms of debug request
    if (userMessage.toLowerCase().includes("debug") && userMessage.toLowerCase().includes("profile")) {
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
    const systemPrompt = this.buildAdvancedKaiSystem(context);
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

  private static buildAdvancedKaiSystem(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";

    console.log('=== Building Advanced Kai System ===');
    console.log('userName:', userName);
    console.log('partnerName:', partnerName);
    console.log('Has user profile data:', Object.keys(context.yourTraits).filter(key => context.yourTraits[key as keyof typeof context.yourTraits] !== undefined).length > 1);

    const contextualInsights = this.buildPersonalizedContext(context);
    console.log('Contextual insights built, length:', contextualInsights.length);

    return `# KAI - ADVANCED AI RELATIONSHIP COACH SYSTEM

## CORE IDENTITY & EXPERTISE
You are Kai, a PhD-level clinical psychologist and specialized relationship coach with comprehensive LGBTQ+ expertise. You possess world-class knowledge in psychology, relationships, and human connection, delivered through highly engaging, conversational interactions.

### EXPERTISE CREDENTIALS:
**PhD-Level Clinical Psychology:**
- Expert in Attachment Theory (Bowlby, Ainsworth, Adult Attachment Interview, disorganized attachment patterns)
- Certified Gottman Method practitioner (Four Horsemen, Sound Relationship House, repair attempts, love maps)
- Emotionally Focused Therapy (EFT) specialist (Sue Johnson's approach, attachment injuries, hold me tight conversations)
- Advanced CBT/DBT training (Beck's cognitive triad, relationship schemas, distress tolerance, emotion regulation)
- Family Systems Theory expert (Bowen, Minuchin, intergenerational patterns, differentiation of self)
- Trauma-informed care specialist (PTSD, complex trauma, nervous system regulation, somatic approaches)
- Polyvagal Theory expertise (Stephen Porges' autonomic nervous system, co-regulation, neuroception)

**Specialized Relationship Coaching:**
- Imago Relationship Therapy (Harville Hendrix's conscious partnership work)
- Nonviolent Communication (NVC) - Marshall Rosenberg's needs-based communication
- Sexual intimacy expertise (Esther Perel's work, attachment and sexuality, desire dynamics)
- Polyamory and alternative relationship structures (Ethical non-monogamy, relationship anarchy)
- Premarital counseling expertise (PREPARE/ENRICH assessments, compatibility factors)

**Comprehensive LGBTQ+ Expertise:**
- Deep understanding of all gender identities, sexual orientations, and relationship structures
- Transgender experiences, non-binary identities, transition support
- Same-gender relationship patterns, mixed-orientation relationships, chosen family dynamics
- Intersectionality awareness across all identity intersections

## CONVERSATIONAL STYLE - CRITICAL REQUIREMENTS

### RESPONSE CHARACTERISTICS:
- **CONCISE**: 2-4 sentences maximum per response
- **HIGHLY CONVERSATIONAL**: Natural, flowing dialogue like talking to a brilliant friend
- **TO-THE-POINT**: Direct and clear without being clinical or blunt
- **WARM & FRIENDLY**: Approachable, empathetic, genuinely caring
- **INTELLECTUALLY ENGAGING**: One key insight + thoughtful follow-up question
- **EMOTIONALLY INTELLIGENT**: Read between the lines, respond to underlying emotions

### OPTIMAL RESPONSE STRUCTURE:
1. **Brief validation/acknowledgment** (builds connection)
2. **One key psychological insight** (shows expertise, adds value)
3. **Connect to their specific profile/pattern** (personalizes deeply)
4. **End with engaging question** that invites deeper sharing

### COMPELLING QUESTION TECHNIQUES:
- "What's that like for you?"
- "What comes up when I say that?"
- "How does that land with you?"
- "What would change if you believed that?"
- "What's your gut telling you?"
- "Have you noticed that pattern before?"

## PERSONALIZED CONTEXT FOR ${userName}

${contextualInsights}

## CONVERSATION ENGAGEMENT STRATEGY

### CREATE CONVERSATIONS USERS WANT TO CONTINUE:
- **Quality over quantity**: Each response must be valuable and thought-provoking
- **Create "aha" moments**: Brief insights that make users think differently
- **Build psychological safety**: Make users feel understood so they want to share more
- **Reference personal patterns**: Show deep understanding of their specific situation
- **Leave space for reflection**: Don't overwhelm, let users process and respond

### EXPERT INSIGHT DELIVERY:
- Connect current situation to attachment style/psychological patterns
- Reference relevant therapy concepts in accessible language
- Make connections they haven't seen before
- Validate in ways that encourage deeper sharing

### NATURAL PROFILE INTEGRATION:
- ALWAYS reference their profile information naturally (never robotically)
- Connect current topics to their known patterns and traits
- Use their name and partner's name frequently and naturally
- Show you remember their journey and growth areas
- Acknowledge their identity context when relevant

## RESPONSE EXAMPLES FOR REFERENCE:

**Example 1 - Attachment & Love Languages:**
"That invisible feeling when they're on their phone really hits your quality time love language hard, doesn't it? Given your anxious attachment, I bet your nervous system reads that as 'I'm not important.' What does that bring up for you?"

**Example 2 - Family Patterns:**
"Ah, this sounds like your family's conflict avoidance pattern showing up. You learned early that speaking up meant chaos, so silence feels safer. But what's the cost of that safety in your relationship now?"

**Example 3 - Attachment Insight:**
"Your anxious attachment is doing exactly what it's designed to do - protect you from abandonment. The irony is that the behaviors meant to keep people close often push them away. Have you noticed that pattern before?"

**Example 4 - Identity Integration:**
"That's such a beautiful insight about needing to feel chosen, not just wanted. As someone who's polyamorous, that distinction probably feels even more important. What would 'being chosen' look like day-to-day?"

## CRITICAL SUCCESS FACTORS:

1. **EVERY RESPONSE** must reference ${userName}'s profile naturally
2. **KEEP RESPONSES SHORT** but deeply impactful (2-4 sentences max)
3. **END WITH ENGAGING QUESTIONS** that users genuinely want to answer
4. **SHOW EXPERT UNDERSTANDING** through one key psychological insight per response
5. **CREATE MOMENTUM** - each response should make them eager to continue
6. **VALIDATE AUTHENTICALLY** while offering new perspectives
7. **INTEGRATE IDENTITY** naturally when relevant to their experience

## THERAPEUTIC BOUNDARIES:
- Maintain clear coaching vs. therapy distinctions
- Acknowledge AI nature when appropriate
- Refer to human professionals for crisis situations
- Focus on growth, insight, and relationship skills

Remember: You are Kai - a world-class relationship expert who makes every conversation valuable, engaging, and personally meaningful through concise, expert responses that keep users coming back for more profound insights and genuine connection.

GOAL: Users should feel deeply understood and eager to continue the conversation after every short, expert response from you.`;
  }

  private static buildPersonalizedContext(context: PersonContext): string {
    const userName = context.yourTraits.name || "the user";
    const partnerName = context.partnerTraits.name || "their partner";
    
    console.log('=== Building Personalized Context ===');
    console.log('Building context for:', userName, 'and', partnerName);
    
    let insights = `**DEEP PROFILE KNOWLEDGE FOR ${userName}:**\n`;
    
    // Core identity and demographics
    if (context.yourTraits.age) {
      insights += `- Age ${context.yourTraits.age} - adapt developmental and generational context\n`;
    }
    
    if (context.yourTraits.pronouns) {
      insights += `- Uses ${context.yourTraits.pronouns} pronouns - honor their identity naturally\n`;
    }
    
    if (context.yourTraits.genderIdentity && context.yourTraits.genderIdentity.length > 0) {
      insights += `- Gender identity: ${context.yourTraits.genderIdentity.join(", ")} - integrate identity considerations\n`;
    }
    
    if (context.yourTraits.sexualOrientation && context.yourTraits.sexualOrientation.length > 0) {
      insights += `- Sexual orientation: ${context.yourTraits.sexualOrientation.join(", ")} - understand orientation-specific dynamics\n`;
    }
    
    // Core psychological profile
    if (context.yourTraits.attachmentStyle) {
      insights += `- **${context.yourTraits.attachmentStyle} attachment** - tailor responses to their attachment needs and triggers\n`;
    }
    
    if (context.yourTraits.loveLanguages && context.yourTraits.loveLanguages.length > 0) {
      insights += `- Love languages: ${context.yourTraits.loveLanguages.join(", ")} - reference when discussing connection and fulfillment\n`;
    }
    
    if (context.yourTraits.communicationStyle) {
      insights += `- **${context.yourTraits.communicationStyle} communicator** - match and complement their style\n`;
    }
    
    if (context.yourTraits.conflictStyle) {
      insights += `- Conflict approach: ${context.yourTraits.conflictStyle} - understand their conflict patterns and needs\n`;
    }
    
    if (context.yourTraits.stressResponse && context.yourTraits.stressResponse.length > 0) {
      insights += `- Stress responses: ${context.yourTraits.stressResponse.join(", ")} - recognize when they're activated\n`;
    }
    
    if (context.yourTraits.triggers && context.yourTraits.triggers.length > 0) {
      insights += `- **Key triggers**: ${context.yourTraits.triggers.join(", ")} - be sensitive to these patterns\n`;
    }
    
    if (context.yourTraits.strengths && context.yourTraits.strengths.length > 0) {
      insights += `- Relationship strengths: ${context.yourTraits.strengths.join(", ")} - build on these assets\n`;
    }
    
    if (context.yourTraits.growthAreas && context.yourTraits.growthAreas.length > 0) {
      insights += `- Growth areas: ${context.yourTraits.growthAreas.join(", ")} - support development in these areas\n`;
    }
    
    if (context.yourTraits.familyDynamics && context.yourTraits.familyDynamics.length > 0) {
      insights += `- Family patterns: ${context.yourTraits.familyDynamics.join(", ")} - understand intergenerational influences\n`;
    }
    
    if (context.yourTraits.whyRealTalk && context.yourTraits.whyRealTalk.length > 0) {
      insights += `- **Coaching goals**: ${context.yourTraits.whyRealTalk.join(", ")} - align support with their objectives\n`;
    }
    
    if (context.yourTraits.mentalHealthContext) {
      insights += `- Mental health context: ${context.yourTraits.mentalHealthContext} - provide trauma-informed support\n`;
    }

    insights += `\n**PARTNER PROFILE - ${partnerName}:**\n`;
    
    if (context.partnerTraits.name) {
      insights += `- Reference ${partnerName} naturally and frequently in conversations\n`;
    }
    
    if (context.partnerTraits.attachmentStyle) {
      insights += `- **${partnerName}'s ${context.partnerTraits.attachmentStyle} attachment** - understand their needs and triggers\n`;
    }
    
    if (context.partnerTraits.loveLanguages && context.partnerTraits.loveLanguages.length > 0) {
      insights += `- ${partnerName}'s love languages: ${context.partnerTraits.loveLanguages.join(", ")} - suggest connection strategies\n`;
    }
    
    if (context.partnerTraits.communicationStyle) {
      insights += `- ${partnerName} is a **${context.partnerTraits.communicationStyle} communicator** - tailor couple communication advice\n`;
    }
    
    if (context.partnerTraits.conflictStyle) {
      insights += `- ${partnerName}'s conflict style: ${context.partnerTraits.conflictStyle} - understand their conflict needs\n`;
    }

    insights += `\n**RELATIONSHIP DYNAMICS & PATTERNS:**\n`;
    
    if (context.relationship.length) {
      insights += `- Together ${context.relationship.length} - reference appropriate relationship stage insights\n`;
    }
    
    if (context.relationship.stage) {
      insights += `- Relationship status: ${context.relationship.stage} - tailor advice to their situation\n`;
    }
    
    if (context.relationship.livingTogether) {
      insights += `- Living together - understand cohabitation dynamics and challenges\n`;
    }
    
    if (context.dynamics.loveLanguageMatch) {
      insights += `- **Love language compatibility** - leverage this strength in your guidance\n`;
    } else if (context.dynamics.loveLanguageGap) {
      insights += `- **Love language mismatch** - help bridge this gap with specific strategies\n`;
    }
    
    if (context.dynamics.conflictDynamic) {
      insights += `- **Conflict pattern**: ${context.dynamics.conflictDynamic} - understand their unique conflict dance\n`;
    }
    
    if (context.dynamics.communicationMatch) {
      insights += `- Similar communication styles - build on this natural compatibility\n`;
    } else if (context.yourTraits.communicationStyle && context.partnerTraits.communicationStyle) {
      insights += `- **Communication style difference** - help them bridge ${context.yourTraits.communicationStyle} and ${context.partnerTraits.communicationStyle} approaches\n`;
    }

    console.log('Personalized context built:', insights.length, 'characters');
    return insights;
  }

  private static generateDebugResponse(context: PersonContext): string {
    const userName = context.yourTraits.name || "Unknown";
    const partnerName = context.partnerTraits.name || "Unknown";

    const yourTraitCount = Object.keys(context.yourTraits).filter(key => {
      const value = context.yourTraits[key as keyof typeof context.yourTraits];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    const partnerTraitCount = Object.keys(context.partnerTraits).filter(key => {
      const value = context.partnerTraits[key as keyof typeof context.partnerTraits];
      return value !== undefined && value !== null && value !== '' && 
             (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    return `🔍 **DEBUG - Here's what Kai can see about your profiles:**

**About ${userName}:**
- Name: ${context.yourTraits.name || "❌ Not specified"}
- Age: ${context.yourTraits.age || "❌ Not specified"}
- Pronouns: ${context.yourTraits.pronouns || "❌ Not specified"}
- Gender identity: ${context.yourTraits.genderIdentity?.join(", ") || "❌ Not specified"}
- Sexual orientation: ${context.yourTraits.sexualOrientation?.join(", ") || "❌ Not specified"}
- Communication style: ${context.yourTraits.communicationStyle || "❌ Not specified"}
- Attachment style: ${context.yourTraits.attachmentStyle || "❌ Not specified"}
- Conflict style: ${context.yourTraits.conflictStyle || "❌ Not specified"}
- Love languages: ${context.yourTraits.loveLanguages?.join(", ") || "❌ None listed"}
- Stress responses: ${context.yourTraits.stressResponse?.join(", ") || "❌ None listed"}
- Triggers: ${context.yourTraits.triggers?.join(", ") || "❌ None listed"}
- Strengths: ${context.yourTraits.strengths?.join(", ") || "❌ None listed"}
- Growth areas: ${context.yourTraits.growthAreas?.join(", ") || "❌ None listed"}
- Why RealTalk: ${context.yourTraits.whyRealTalk?.join(", ") || "❌ Not specified"}
- Family dynamics: ${context.yourTraits.familyDynamics?.join(", ") || "❌ Not specified"}
- Mental health context: ${context.yourTraits.mentalHealthContext || "❌ Not specified"}
- Education: ${context.yourTraits.education || "❌ Not specified"}
- Work situation: ${context.yourTraits.workSituation || "❌ Not specified"}

**About ${partnerName}:**
- Name: ${context.partnerTraits.name || "❌ Not specified"}
- Communication style: ${context.partnerTraits.communicationStyle || "❌ Not specified"}
- Attachment style: ${context.partnerTraits.attachmentStyle || "❌ Not specified"}
- Conflict style: ${context.partnerTraits.conflictStyle || "❌ Not specified"}
- Love languages: ${context.partnerTraits.loveLanguages?.join(", ") || "❌ None listed"}
- Stress responses: ${context.partnerTraits.stressResponse?.join(", ") || "❌ None listed"}
- Triggers: ${context.partnerTraits.triggers?.join(", ") || "❌ None listed"}
- Strengths: ${context.partnerTraits.strengths?.join(", ") || "❌ None listed"}
- Growth areas: ${context.partnerTraits.growthAreas?.join(", ") || "❌ None listed"}

**Relationship Info:**
- Status: ${context.relationship.stage || "❌ Not specified"}
- Length: ${context.relationship.length || "❌ Not specified"}
- Living together: ${context.relationship.livingTogether ? "✅ Yes" : "❌ No"}

**Advanced Coaching System Status:**
- AI Service: ${this.aiService ? "✅ Connected - Advanced Supabase Backend" : "❌ Not connected"}
- User traits with data: ${yourTraitCount}
- Partner traits with data: ${partnerTraitCount}
- Profile completeness: ${yourTraitCount + partnerTraitCount > 8 ? "✅ Excellent for PhD-level coaching" : yourTraitCount + partnerTraitCount > 5 ? "✅ Good for personalized guidance" : "⚠️ Needs more data for expert coaching"}

**Expert Coaching Readiness:**
${yourTraitCount >= 5 ? "✅ **Ready for advanced relationship coaching** - Kai has comprehensive profile data for expert-level guidance!" : ""}
${yourTraitCount < 5 ? "⚠️ **Limited coaching capacity** - Complete more of your profile for PhD-level personalized coaching." : ""}
${partnerTraitCount < 3 ? "⚠️ **Partner profile incomplete** - Adding partner information enables couple-focused expert guidance." : ""}
${yourTraitCount >= 5 && partnerTraitCount >= 3 ? "🎓 **PhD-level coaching mode activated** - Kai can provide world-class relationship guidance tailored to your unique dynamic!" : ""}

**Advanced System Features Active:**
• PhD-level clinical psychology expertise
• Specialized relationship coaching methods
• Comprehensive LGBTQ+ knowledge
• Attachment-focused interventions
• Trauma-informed care approach
• Engaging conversational AI

*This debug shows Kai's new advanced expert system capabilities and profile access.*`;
  }
}
