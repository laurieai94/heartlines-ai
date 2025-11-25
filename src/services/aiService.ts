interface AIServiceConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;
  
  constructor(config: AIServiceConfig) {
    this.supabaseUrl = config.supabaseUrl;
    this.supabaseAnonKey = config.supabaseAnonKey;
  }

  async generateResponse(
    userMessage: string,
    systemPrompt: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    console.log('Making request to Supabase Edge Function...');
    
    // Limit conversation history to last 20 messages to reduce token usage
    const limitedHistory = conversationHistory.slice(-20);
    
    if (conversationHistory.length > 20) {
      console.log(`Truncated history from ${conversationHistory.length} to 20 messages`);
    }
    
    // Import supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
    
    try {
      const { data, error } = await supabase.functions.invoke('anthropic-chat', {
        body: {
          userMessage,
          systemPrompt,
          conversationHistory: limitedHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });

      if (error) {
        console.error('Edge Function Error:', error);
        
        // Handle different types of errors
        const errorMessage = error.message || 'Unknown error';
        
        if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
          throw new Error('🔑 **API Key Issue**\n\nThere seems to be an issue with the AI service authentication. Please check your API key configuration.');
        } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
          throw new Error('⏰ **Rate Limit Reached**\n\nToo many requests! Please wait a moment before trying again.');
        } else if (errorMessage.includes('Service temporarily unavailable') || errorMessage.includes('500')) {
          throw new Error(`🔧 **Service Issue**\n\n${errorMessage}`);
        } else {
          throw new Error(`🚨 **Connection Issue**\n\nUnable to reach the AI service: ${errorMessage}`);
        }
      }
      
      if (data?.response) {
        console.log('AI Response received successfully');
        return data.response;
      } else {
        console.error('Invalid response format:', data);
        throw new Error('🔧 **Response Format Issue**\n\nReceived an unexpected response format from the AI service.');
      }
      
    } catch (error) {
      console.error('AI Service Error:', error);
      
      if (error.message.includes('Invalid Anthropic API key')) {
        throw new Error('🔑 **Invalid API Key**\n\nThe Anthropic API key is invalid. Please check your API key in the Supabase Edge Function Secrets.');
      }
      
      if (error.message.includes('Rate limit')) {
        throw new Error('⏱️ **Rate Limit Exceeded**\n\nPlease wait a moment before sending another message.');
      }
      
      if (error.message.includes('fetch')) {
        throw new Error('🌐 **Connection Issue**\n\nUnable to connect to the AI service. Please check your internet connection and try again.');
      }
      
      throw new Error(`❌ **AI Service Error**\n\n${error.message}`);
    }
  }
}