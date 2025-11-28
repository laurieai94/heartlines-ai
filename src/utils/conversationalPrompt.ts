
import { PersonContext, ProfileData, DemographicsData } from "@/types/AIInsights";
import { InsightBuilders } from "./prompt/insightBuilders";
import { FamilyBackgroundBuilder } from "./prompt/familyBackgroundBuilder";
import { DynamicsBuilder } from "./prompt/dynamicsBuilder";
import { RelationshipMapper } from "./prompt/relationshipMapper";
import { PromptTemplate } from "./prompt/promptTemplate";
import { GoalsBuilder } from "./prompt/goalsBuilder";
import { ProfileGoalsUtility } from "./profileGoals";

export class ConversationalPromptBuilder {
  /**
   * Build separate static and dynamic prompts for caching
   */
  static buildPromptParts(context: PersonContext, conversationHistory: any[] = []): {
    staticPrompt: string;
    userContext: string;
  } {
    const yourName = context.yourTraits?.name || '';
    const partnerName = context.partnerTraits?.name || '';
    
    // Build relationship portrait using new integrated format
    const relationshipPortrait = RelationshipMapper.buildRelationshipPortrait(context);
    const partnerPortrait = RelationshipMapper.buildPartnerPortrait(context);
    const frictionPoints = RelationshipMapper.buildFrictionPoints(context);
    const familyBackgroundInsights = FamilyBackgroundBuilder.buildFamilyBackgroundInsights(context);
    
    // Keep legacy insights for backward compatibility
    const dynamics = DynamicsBuilder.buildDynamics(context);
    
    // Build goals insights from profile data
    const goalsInsights = GoalsBuilder.buildGoalsInsights(
      null,
      null,
      [],
      []
    );
    
    const staticPrompt = PromptTemplate.buildStaticSystemPrompt();
    const userContext = PromptTemplate.buildUserContext(
      yourName,
      partnerName,
      context,
      conversationHistory,
      relationshipPortrait,
      partnerPortrait,
      frictionPoints,
      familyBackgroundInsights,
      dynamics,
      goalsInsights
    );
    
    return { staticPrompt, userContext };
  }

  /**
   * Legacy method - returns combined prompt for backward compatibility
   */
  static buildConversationalPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    const yourName = context.yourTraits?.name || '';
    const partnerName = context.partnerTraits?.name || '';
    
    // Check if this is a data access verification request
    const lastMessage = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
    const isDataTestRequest = lastMessage && 
      (lastMessage.content.toLowerCase().includes('list everything') || 
       lastMessage.content.toLowerCase().includes('what do you know') ||
       lastMessage.content.toLowerCase().includes('show me all') ||
       lastMessage.content.toLowerCase().includes('tell me everything'));
    
    if (isDataTestRequest) {
      // Return comprehensive data access test
      const comprehensiveData = InsightBuilders.buildComprehensiveDataTest(context);
      return `You are Kai. The user is asking you to list everything you know about their profiles. Here's what you have access to:

${comprehensiveData}

Respond conversationally, summarizing what you know about them and their relationship in a friendly, natural way. Don't just list the data - weave it into insights about their relationship patterns and what you understand about them as individuals and as a couple.`;
    }
    
    // Build relationship portrait using new integrated format
    const relationshipPortrait = RelationshipMapper.buildRelationshipPortrait(context);
    const partnerPortrait = RelationshipMapper.buildPartnerPortrait(context);
    const frictionPoints = RelationshipMapper.buildFrictionPoints(context);
    const familyBackgroundInsights = FamilyBackgroundBuilder.buildFamilyBackgroundInsights(context);
    
    // Keep legacy insights for backward compatibility
    const personalInsights = InsightBuilders.buildPersonalInsights(context);
    const partnerInsights = InsightBuilders.buildPartnerInsights(context);
    const dynamics = DynamicsBuilder.buildDynamics(context);
    
    // Build goals insights from profile data
    const goalsInsights = GoalsBuilder.buildGoalsInsights(
      null, // derivedGoals - will be null here, goals derived in AI component
      null, // partnerGoals - will be null here 
      [], // goalsSummary - empty array as fallback
      [] // priorityChallenges - empty array as fallback
    );
    
    const { staticPrompt, userContext } = this.buildPromptParts(context, conversationHistory);
    return `${staticPrompt}\n\n${userContext}`;
  }

  static buildDebugPrompt(context: PersonContext, profiles: ProfileData, demographicsData: DemographicsData): string {
    return PromptTemplate.buildDebugPrompt(context, profiles, demographicsData);
  }
}
