
import { PersonContextBuilder } from "@/utils/personContext";
import { ConversationalPromptBuilder } from "@/utils/conversationalPrompt";
import { AIResponseCoordinator } from "@/utils/aiResponseCoordinator";
import { ProfileData, DemographicsData, PersonContext } from "@/types/AIInsights";

export class AICoachEngine {
  static buildPersonContext(profiles: ProfileData, demographicsData: DemographicsData): PersonContext {
    return PersonContextBuilder.buildPersonContext(profiles, demographicsData);
  }

  static initializeSupabase(): boolean {
    return AIResponseCoordinator.initializeSupabase();
  }

  static async buildConversationalPrompt(
    context: PersonContext, 
    conversationHistory: any[] = [],
    userId?: string
  ): Promise<string> {
    // Fetch conversation memory if userId provided
    let conversationMemory = '';
    if (userId) {
      const { ConversationMemory } = await import('@/utils/conversationMemory');
      conversationMemory = await ConversationMemory.fetchConversationSummary(userId);
    }
    
    return ConversationalPromptBuilder.buildConversationalPrompt(context, conversationHistory, conversationMemory);
  }

  static buildDebugPrompt(context: PersonContext, profiles: ProfileData, demographicsData: DemographicsData): string {
    return ConversationalPromptBuilder.buildDebugPrompt(context, profiles, demographicsData);
  }

  static async getAIResponse(
    userMessage: string, 
    context: PersonContext, 
    conversationHistory: any[] = [],
    customPrompt?: string
  ): Promise<string> {
    return AIResponseCoordinator.getAIResponse(userMessage, context, conversationHistory, customPrompt);
  }
}
