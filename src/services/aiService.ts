
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
    
    const functionUrl = `${this.supabaseUrl}/functions/v1/anthropic-chat`;
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          userMessage,
          systemPrompt,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Supabase Function Error:', response.status, errorData);
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.response) {
        console.log('AI response received successfully');
        return data.response;
      } else {
        throw new Error('Invalid response format from AI service');
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
