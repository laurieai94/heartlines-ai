
import { PersonContext, ProfileData, DemographicsData } from "@/types/AIInsights";
import { InsightBuilders } from "./prompt/insightBuilders";
import { FamilyBackgroundBuilder } from "./prompt/familyBackgroundBuilder";
import { DynamicsBuilder } from "./prompt/dynamicsBuilder";
import { PromptTemplate } from "./prompt/promptTemplate";
import { GoalsBuilder } from "./prompt/goalsBuilder";
import { ProfileGoalsUtility } from "./profileGoals";

export class ConversationalPromptBuilder {
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
    
    // Build insights using the new modular structure
    const personalInsights = InsightBuilders.buildPersonalInsights(context);
    const partnerInsights = InsightBuilders.buildPartnerInsights(context);
    const familyBackgroundInsights = FamilyBackgroundBuilder.buildFamilyBackgroundInsights(context);
    const dynamics = DynamicsBuilder.buildDynamics(context);
    
    // Build goals insights from profile data
    const goalsInsights = GoalsBuilder.buildGoalsInsights(
      null, // derivedGoals - will be null here, goals derived in AI component
      null, // partnerGoals - will be null here 
      [], // goalsSummary - empty array as fallback
      [] // priorityChallenges - empty array as fallback
    );
    
    // Build the complete prompt using the template
    return PromptTemplate.buildMainPrompt(
      yourName,
      partnerName,
      personalInsights,
      partnerInsights,
      context,
      familyBackgroundInsights,
      dynamics,
      conversationHistory,
      goalsInsights
    );
  }

  static buildDebugPrompt(context: PersonContext, profiles: ProfileData, demographicsData: DemographicsData): string {
    return PromptTemplate.buildDebugPrompt(context, profiles, demographicsData);
  }
}
