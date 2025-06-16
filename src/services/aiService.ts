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
  
  // Multiple CORS proxy options to try
  private corsProxies = [
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
  ];

  constructor(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'claude-3-5-sonnet-20241022';
  }

  async generateResponse(
    userMessage: string,
    systemPrompt: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: userMessage }
    ];

    // First try direct connection (might work in some environments)
    try {
      console.log('Attempting direct API connection...');
      const response = await this.makeDirectRequest(messages, systemPrompt);
      return response;
    } catch (directError) {
      console.log('Direct connection failed, trying CORS proxies...');
      
      // Try each CORS proxy
      for (let i = 0; i < this.corsProxies.length; i++) {
        try {
          console.log(`Trying CORS proxy ${i + 1}/${this.corsProxies.length}:`, this.corsProxies[i]);
          const response = await this.makeProxyRequest(messages, systemPrompt, this.corsProxies[i]);
          return response;
        } catch (proxyError) {
          console.log(`CORS proxy ${i + 1} failed:`, proxyError.message);
          if (i === this.corsProxies.length - 1) {
            // All proxies failed
            throw new Error('All connection methods failed. This appears to be a widespread CORS proxy issue. Please try again later or consider running the app through a backend server.');
          }
        }
      }
    }

    throw new Error('Unexpected error in connection logic.');
  }

  private async makeDirectRequest(messages: ChatMessage[], systemPrompt: string): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1000,
        messages: messages,
        system: systemPrompt
      })
    });

    return this.handleResponse(response);
  }

  private async makeProxyRequest(messages: ChatMessage[], systemPrompt: string, proxyUrl: string): Promise<string> {
    const requestBody = {
      model: this.model,
      max_tokens: 1000,
      messages: messages,
      system: systemPrompt
    };

    if (proxyUrl.includes('allorigins.win')) {
      // AllOrigins requires a different approach - we need to construct the full request
      const fullRequest = {
        url: this.baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      };

      const allOriginsUrl = `${proxyUrl}${encodeURIComponent(this.baseUrl)}&method=POST&headers=${encodeURIComponent(JSON.stringify(fullRequest.headers))}&body=${encodeURIComponent(fullRequest.body)}`;
      
      console.log('Making AllOrigins request...');
      const response = await fetch(allOriginsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`AllOrigins proxy failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.contents) {
        const anthropicResponse = JSON.parse(data.contents);
        if (anthropicResponse.content && anthropicResponse.content[0] && anthropicResponse.content[0].text) {
          return anthropicResponse.content[0].text;
        } else {
          throw new Error('Invalid response format from Anthropic API');
        }
      } else {
        throw new Error('AllOrigins proxy returned invalid format');
      }
    } else {
      // Other proxies expect to be prepended
      const finalUrl = `${proxyUrl}${this.baseUrl}`;
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(requestBody)
      });

      return this.handleResponse(response);
    }
  }

  private async handleResponse(response: Response): Promise<string> {
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Anthropic API key.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status === 403 && errorText.includes('corsdemo')) {
        throw new Error('CORS proxy access denied. The public CORS proxy is currently restricting access.');
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
  }
}
