
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'
import { LIGHT_PROMPT } from './lightPrompt.ts'

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

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
    const { userMessage, systemPrompt, conversationHistory = [], personSummary } = await req.json()

    if (!userMessage || !systemPrompt) {
      throw new Error('userMessage and systemPrompt are required')
    }

    console.log('Processing chat request...')

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

    // Message complexity classification (tuned for better Haiku usage)
    const classifyMessageComplexity = (message: string): 'simple' | 'complex' => {
      const lowerMessage = message.toLowerCase().trim();
      
      // Complex keywords (crisis, emotional depth, relationship issues) - check first
      const complexKeywords = [
        'suicide', 'kill', 'hurt', 'abuse', 'trauma', 'ptsd', 'crisis',
        'cheating', 'affair', 'divorce', 'breakup', 'trust', 'betrayed',
        'panic', 'anxiety', 'depressed', 'scared', 'terrified', 'hopeless',
        'help', 'lost', 'alone', 'hate', 'angry', 'furious', 'devastated'
      ];
      
      // If contains complex keywords or very long, definitely complex
      if (complexKeywords.some(kw => lowerMessage.includes(kw)) || message.length > 200) {
        return 'complex';
      }
      
      // Simple patterns (greetings, acknowledgments, short messages)
      const simplePatterns = [
        /^(hi|hey|hello|thanks|thank you|ok|okay|yes|yeah|yep|no|nope|sure|got it|i see|go on|continue|tell me more)\.?$/i,
      ];
      
      if (simplePatterns.some(p => p.test(lowerMessage))) {
        return 'simple';
      }
      
      // Medium-length messages without emotional keywords = simple
      // Increased threshold from 30 to 150 chars to route more to Haiku
      if (message.length <= 150) {
        return 'simple';
      }
      
      return 'complex';
    };

    // Model selection based on complexity
    const getModelConfig = (complexity: 'simple' | 'complex') => {
      if (complexity === 'simple') {
        return {
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 150,
          inputCostPer1M: 0.0000008,
          outputCostPer1M: 0.000004,
          useLight: true // Use light prompt for simple messages
        };
      }
      return {
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 400,
        inputCostPer1M: 0.000003,
        outputCostPer1M: 0.000015,
        useLight: false // Use full prompt for complex messages
      };
    };

    // Truncate conversation history to last 15 messages
    const truncateHistory = (history: any[], maxMessages: number = 15) => {
      if (history.length <= maxMessages) return history;
      return history.slice(-maxMessages);
    };

    // Classify message and select model
    const complexity = classifyMessageComplexity(userMessage);
    const modelConfig = getModelConfig(complexity);
    
    console.log(`Message complexity: ${complexity}, using model: ${modelConfig.model}`);

    // Truncate history and build messages
    const truncatedHistory = truncateHistory(conversationHistory);
    const messages = [
      ...truncatedHistory,
      { role: 'user', content: userMessage }
    ];

    // Use light prompt for simple messages to reduce token usage
    // Append person summary to light prompt for personalization
    const finalSystemPrompt = modelConfig.useLight 
      ? `${LIGHT_PROMPT}\n\n${personSummary || ''}`
      : systemPrompt;
    
    console.log(`Calling Anthropic API with ${modelConfig.model} (${modelConfig.useLight ? 'light prompt' : 'full prompt'})...`);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: modelConfig.model,
        max_tokens: modelConfig.max_tokens,
        messages: messages,
        system: finalSystemPrompt
      })
    })

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
      // Enforce lowercase for Kai's texting-style voice
      const responseText = data.content[0].text.toLowerCase();
      
      // Log token usage
      try {
        const inputTokens = data.usage?.input_tokens || 0;
        const outputTokens = data.usage?.output_tokens || 0;
        const model = modelConfig.model;
        
        // Calculate cost based on actual model used
        const estimatedCost = (inputTokens * modelConfig.inputCostPer1M) + (outputTokens * modelConfig.outputCostPer1M);
        
        const { error: tokenError } = await supabaseService
          .from('user_token_usage')
          .insert({
            user_id: user.id,
            model: model,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            estimated_cost: estimatedCost
          });
        
        if (tokenError) {
          console.error('Failed to log token usage:', tokenError);
        } else {
          console.log(`Logged token usage: ${inputTokens} input, ${outputTokens} output, $${estimatedCost.toFixed(6)} cost`);
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
      
      return new Response(
        JSON.stringify({ response: responseText }),
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
