
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
