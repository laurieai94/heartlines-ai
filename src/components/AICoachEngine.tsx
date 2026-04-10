
import { PersonContextBuilder } from "@/utils/personContext";
import { ConversationalPromptBuilder } from "@/utils/conversationalPrompt";
import { AIResponseCoordinator } from "@/utils/aiResponseCoordinator";
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    return PersonContextBuilder.buildPersonContext(profiles, demographicsData);
  }


  static buildConversationalPrompt(context: PersonContext, conversationHistory: any[] = []): string {
    return ConversationalPromptBuilder.buildConversationalPrompt(context, conversationHistory);
  }

  static buildDebugPrompt(context: PersonContext, profiles: ProfileData, demographicsData: DemographicsData): string {
    return ConversationalPromptBuilder.buildDebugPrompt(context, profiles, demographicsData);
  }

  static async getAIResponse(
    userMessage: string, 
    context: PersonContext, 
    conversationHistory: any[] = [],
    customPrompt?: string,
    crossSessionMemory?: string
  ): Promise<string> {
    return AIResponseCoordinator.getAIResponse(userMessage, context, conversationHistory, customPrompt, true, crossSessionMemory);
  }
}
