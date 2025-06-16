
interface AIServiceConfig {
  apiKey: string;
  model?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';
  private corsProxy = 'https://cors-anywhere.herokuapp.com/';

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'claude-3-5-sonnet-20241022';
  }

  async generateResponse(
    userMessage: string,
    systemPrompt: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      // Use CORS proxy to bypass browser limitations
      const proxyUrl = `${this.corsProxy}${this.baseUrl}`;
      
      console.log('Making API request via CORS proxy to:', proxyUrl);
      console.log('Request payload:', {
        model: this.model,
        max_tokens: 1000,
        messages: messages.length,
        system: systemPrompt.substring(0, 100) + '...'
      });

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          messages: messages,
          system: systemPrompt
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Anthropic API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else {
          throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('AI Service Error Details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Check if it's still a CORS error even with proxy
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error('Network error: Unable to connect to AI service. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }
}
