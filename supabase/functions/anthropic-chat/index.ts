
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

// Message complexity classifier
const COMPLEX_KEYWORDS = [
  // Crisis indicators
  'suicide', 'suicidal', 'kill myself', 'self-harm', 'abuse', 'abusive',
  'violence', 'assault', 'crisis', 'emergency', 'harm',
  
  // Deep emotional topics
  'trauma', 'ptsd', 'devastated', 'heartbroken', 'betrayed', 'shattered',
  'depressed', 'depression', 'anxiety attack', 'panic attack', 'overwhelmed',
  
  // Complex relationship topics
  'affair', 'cheating', 'infidelity', 'divorce', 'separation', 'custody',
  'break up', 'breaking up', 'ending things', 'trust issues', 'attachment style',
  'toxic', 'narcissist', 'gaslighting', 'manipulation', 'controlling',
  
  // Deep discussions
  'childhood', 'family history', 'past trauma', 'therapy', 'therapist',
  'sexual', 'intimacy issues', 'addiction', 'recovery', 'fertility',
  'miscarriage', 'terminal', 'diagnosis', 'chronic illness'
];

const classifyMessageComplexity = (message: string): 'simple' | 'complex' => {
  const lowercaseMsg = message.toLowerCase();
  
  // Check for complex keywords
  for (const keyword of COMPLEX_KEYWORDS) {
    if (lowercaseMsg.includes(keyword)) {
      return 'complex';
    }
  }
  
  // Short messages (under 50 chars) are likely simple
  if (message.trim().length < 50) {
    return 'simple';
  }
  
  // Very short simple greetings/acknowledgments
  const simplePatterns = [
    /^(hi|hey|hello|thanks|thank you|ok|okay|sure|yes|no|maybe|got it)$/i,
    /^(good morning|good night|how are you|what's up|sup)/i
  ];
  
  for (const pattern of simplePatterns) {
    if (pattern.test(message.trim())) {
      return 'simple';
    }
  }
  
  // Messages with multiple sentences or paragraphs → complex
  const sentenceCount = (message.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 3) {
    return 'complex';
  }
  
  // Default to simple for brevity
  return 'simple';
}

const getModelForComplexity = (complexity: 'simple' | 'complex'): string => {
  return complexity === 'complex' 
    ? 'claude-sonnet-4-5-20250929'  // Premium model for complex topics
    : 'claude-3-5-haiku-20241022';   // Fast, cheap model for simple messages
}

const calculateCost = (model: string, inputTokens: number, outputTokens: number): number => {
  const pricing: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-5-20250929': { input: 0.000003, output: 0.000015 },
    'claude-3-5-haiku-20241022': { input: 0.0000008, output: 0.000004 }
  };
  
  const modelPricing = pricing[model] || pricing['claude-sonnet-4-5-20250929'];
  return (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);
}

// Rough token estimation (chars / 4 ≈ tokens)
const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
}

// Retry with exponential backoff for rate limits
const retryWithBackoff = async (fn: () => Promise<Response>, maxRetries = 3): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fn();
      
      if (response.status === 429) {
        // Check Retry-After header
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        
        if (attempt < maxRetries) {
          console.log(`Rate limited. Retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds and try again.`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }
  
  throw lastError || new Error('Request failed');
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Missing or invalid authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Client for auth verification
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });
    
    // Service role client for database operations
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables')
    }

    console.log('API key found, parsing request body...')
    const { userMessage, systemPrompt, conversationHistory = [] } = await req.json()

    if (!userMessage || !systemPrompt) {
      throw new Error('userMessage and systemPrompt are required')
    }

    console.log('Processing chat request...')
    
    // Limit conversation history to last 20 messages on server side
    let limitedHistory = conversationHistory.slice(-20);
    
    // Estimate tokens for safety check
    const systemTokens = estimateTokens(systemPrompt);
    const historyTokens = limitedHistory.reduce((sum, msg) => sum + estimateTokens(msg.content), 0);
    const userTokens = estimateTokens(userMessage);
    const totalEstimatedTokens = systemTokens + historyTokens + userTokens;
    
    console.log(`Estimated tokens: system=${systemTokens}, history=${historyTokens}, user=${userTokens}, total=${totalEstimatedTokens}`);
    
    // If still too large, aggressively truncate history
    if (totalEstimatedTokens > 80000) {
      const targetHistoryTokens = 10000; // Keep history under 10k tokens
      while (historyTokens > targetHistoryTokens && limitedHistory.length > 5) {
        limitedHistory = limitedHistory.slice(1); // Remove oldest message
      }
      console.log(`Aggressively truncated history to ${limitedHistory.length} messages to stay under 80k token limit`);
    } else if (totalEstimatedTokens > 50000) {
      console.warn(`⚠️ High token usage detected: ~${totalEstimatedTokens} tokens. Consider compressing prompt further.`);
    }

    // Check for account override first
    const { data: userWithEmail } = await supabaseService.auth.getUser(token);
    const userEmail = userWithEmail?.user?.email;
    
    const { data: override } = await supabaseService
      .from('account_overrides')
      .select('unlimited_messages')
      .eq('email', userEmail)
      .eq('unlimited_messages', true)
      .maybeSingle();

    // Skip message limit check if user has unlimited override
    if (!override) {
      // Check message limit before processing
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01 format
      
      // Get current usage and subscription info
      const { data: usageData } = await supabaseService
        .from('user_message_usage')
        .select('current_month_usage, subscription_tier')
        .eq('user_id', user.id)
        .eq('usage_month', currentMonth)
        .maybeSingle();

      const { data: subData } = await supabaseService
        .from('subscribers')
        .select('subscription_tier, subscribed')
        .eq('user_id', user.id)
        .maybeSingle();

      const tier = subData?.subscription_tier || usageData?.subscription_tier || null;
      const currentUsage = usageData?.current_month_usage || 0;
      
      // Determine message limit based on tier
      const getMessageLimit = (tier: string | null): number => {
        switch (tier?.toLowerCase()) {
          case 'grow': return 150;
          case 'thrive': return 300;
          case 'unlimited': return 0; // 0 = unlimited
          default: return 25; // free tier
        }
      };

      const messageLimit = getMessageLimit(tier);
      
      // Check if user has exceeded their limit (skip check for unlimited)
      if (messageLimit > 0 && currentUsage >= messageLimit) {
        console.log(`User ${user.id} has exceeded message limit: ${currentUsage}/${messageLimit}`);
        return new Response(
          JSON.stringify({ 
            error: 'limit_reached',
            message: 'Monthly message limit reached. Upgrade to continue.',
            current_usage: currentUsage,
            message_limit: messageLimit
          }),
          { 
            status: 402, // Payment Required
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    const messages = [
      ...limitedHistory,
      { role: 'user', content: userMessage }
    ]

    // Classify message complexity and select appropriate model
    const complexity = classifyMessageComplexity(userMessage);
    const selectedModel = getModelForComplexity(complexity);
    
    // Detect pure greetings for ultra-short responses
    const isGreeting = /^(hi|hey|hello|sup|yo|hiya|howdy)[\s!?.]*$/i.test(userMessage.trim());
    
    // Dynamic max_tokens based on message type
    const maxTokens = isGreeting ? 80 : (complexity === 'complex' ? 400 : 150);
    
    console.log(`Message classified as ${complexity}, greeting=${isGreeting}, using model: ${selectedModel}, max_tokens: ${maxTokens}`);
    
    const response = await retryWithBackoff(() => fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: maxTokens,
        messages: messages,
        system: systemPrompt
      })
    }));

    console.log('Anthropic API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Anthropic API Error:', response.status)
      
      if (response.status === 401) {
        throw new Error('Authentication failed')
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      } else {
        throw new Error(`API request failed with status: ${response.status}`)
      }
    }

    const data = await response.json()
    console.log('Anthropic API response received successfully')
    
    if (data.content && data.content[0] && data.content[0].text) {
      // Log token usage with correct model pricing
      try {
        const inputTokens = data.usage?.input_tokens || 0;
        const outputTokens = data.usage?.output_tokens || 0;
        
        // Calculate cost based on the model actually used
        const estimatedCost = calculateCost(selectedModel, inputTokens, outputTokens);
        
        const { error: tokenError } = await supabaseService
          .from('user_token_usage')
          .insert({
            user_id: user.id,
            model: selectedModel,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            estimated_cost: estimatedCost
          });
        
        if (tokenError) {
          console.error('Failed to log token usage:', tokenError);
        } else {
          console.log(`Logged token usage: ${inputTokens} input, ${outputTokens} output, $${estimatedCost.toFixed(6)} cost (${selectedModel})`);
        }
      } catch (tokenErr) {
        console.error('Error logging token usage:', tokenErr);
      }
      // Increment message usage after successful AI response
      try {
        const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01 format
        console.log(`Incrementing message usage for user ${user.id}, month ${currentMonth}`);
        
        const { error: usageError } = await supabaseService.rpc('increment_message_usage', {
          p_user_id: user.id,
          p_usage_month: currentMonth,
          p_delta: 1
        });
        
        if (usageError) {
          console.error('Failed to increment message usage:', usageError);
        } else {
          console.log('Message usage incremented successfully');
        }
      } catch (usageErr) {
        console.error('Error incrementing message usage:', usageErr);
      }

      // Generate incremental conversation summary after 5+ messages
      try {
        const totalMessages = limitedHistory.length + 1; // +1 for current message
        
        if (totalMessages >= 5 && totalMessages % 5 === 0) { // Every 5 messages
          console.log(`Generating incremental conversation summary for user ${user.id} after ${totalMessages} messages`);
          
          // Get existing summary
          const { data: existingSummary } = await supabaseService
            .from('conversation_summaries')
            .select('summary_text, key_topics, conversation_count')
            .eq('user_id', user.id)
            .maybeSingle();
          
          // Only use last 5 messages for incremental update
          const recentMessages = messages.slice(-5).map(msg => 
            `${msg.role}: ${msg.content}`
          ).join('\n\n');
          
          const existingSummaryText = existingSummary?.summary_text || 'No previous summary.';
          
          // Call Claude Haiku to generate incremental summary update
          const summaryResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
              model: 'claude-3-5-haiku-20241022',
              max_tokens: 150, // Reduced from 300 for tighter summaries
              messages: [{
                role: 'user',
                content: `Previous summary: ${existingSummaryText}\n\nNew messages:\n${recentMessages}\n\nUpdate the summary in 2-3 sentences combining previous insights with new developments. Extract 3-5 key topics. Return JSON: {"summary": "...", "topics": ["topic1", "topic2"]}`
              }],
              system: 'You are a relationship conversation summarizer. Return only valid JSON with "summary" and "topics" fields.'
            })
          });
          
          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            const summaryText = summaryData.content?.[0]?.text || '';
            
            // Parse JSON from response
            const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              
              if (existingSummary) {
                // Update existing summary incrementally
                await supabaseService
                  .from('conversation_summaries')
                  .update({
                    summary_text: parsed.summary,
                    key_topics: parsed.topics || [],
                    conversation_count: existingSummary.conversation_count + 1,
                    last_updated: new Date().toISOString()
                  })
                  .eq('user_id', user.id);
                
                console.log('Updated conversation summary incrementally');
              } else {
                // Insert new summary
                await supabaseService
                  .from('conversation_summaries')
                  .insert({
                    user_id: user.id,
                    summary_text: parsed.summary,
                    key_topics: parsed.topics || [],
                    conversation_count: 1
                  });
                
                console.log('Created new conversation summary');
              }
            }
          }
        }
      } catch (summaryErr) {
        console.error('Error generating conversation summary:', summaryErr);
        // Don't fail the request if summary generation fails
      }
      
      return new Response(
        JSON.stringify({ response: data.content[0].text }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      )
    } else {
      console.error('Invalid response format from API')
      throw new Error('Invalid response format from API')
    }

  } catch (error) {
    console.error('Edge Function Error:', error.message)
    
    // Sanitize error message for security
    const sanitizedError = error.message?.includes('Authentication') ? 'Authentication failed' :
                          error.message?.includes('Rate limit') ? 'Rate limit exceeded' :
                          'Service temporarily unavailable';
    
    return new Response(
      JSON.stringify({ 
        error: sanitizedError
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
