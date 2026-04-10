
import { AIService, MessageLimitError } from "@/services/aiService";
import { PersonContext } from "@/types/AIInsights";
import { ConversationalPromptBuilder } from "./conversationalPrompt";

export class AIResponseCoordinator {

  static async getAIResponse(
    userMessage: string, 
    context: PersonContext, 
    conversationHistory: any[] = [], 
    customPrompt?: string,
    useSplitPrompt: boolean = true,
    crossSessionMemory: string = ''
  ): Promise<string> {
    try {
      // Build the conversational prompt
      let promptInput: string | { staticPrompt: string; userContext: string };
      
      if (customPrompt) {
        promptInput = customPrompt;
      } else if (useSplitPrompt) {
        // Use split prompts for caching
        promptInput = ConversationalPromptBuilder.buildPromptParts(context, conversationHistory, crossSessionMemory);
      } else {
        // Legacy single prompt
        promptInput = ConversationalPromptBuilder.buildConversationalPrompt(context, conversationHistory);
      }
      
      const aiService = new AIService();
      const response = await aiService.generateResponse(
        userMessage,
        promptInput,
        conversationHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      );

      // Post-process response to ensure brevity
      return this.enforceResponseBrevity(response);
    } catch (error) {
      console.error('Error in getAIResponse:', error);
      
      // Re-throw MessageLimitError so it can be handled by the caller
      if (error instanceof MessageLimitError) {
        throw error;
      }
      
      const userName = context.yourTraits.name || 'you';
      const partnerName = context.partnerTraits.name || context.yourTraits.name ? 'your partner' : 'they';
      
      // Only use fallbacks for actual technical errors
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

  private static enforceResponseBrevity(response: string): string {
    const words = response.trim().split(/\s+/);
    const wordCount = words.length;
    
    if (wordCount <= 60) {
      return response;
    }
    
    const sentences = response.split(/[.!?]+/).filter(s => s.trim());
    
    if (sentences.length === 1) {
      return words.slice(0, 60).join(' ') + '...';
    }
    
    let truncated = '';
    let currentWordCount = 0;
    
    for (const sentence of sentences) {
      const sentenceWords = sentence.trim().split(/\s+/).length;
      if (currentWordCount + sentenceWords <= 60) {
        truncated += sentence.trim() + '. ';
        currentWordCount += sentenceWords;
      } else {
        break;
      }
    }
    
    return truncated.trim() || words.slice(0, 60).join(' ') + '...';
  }
}
