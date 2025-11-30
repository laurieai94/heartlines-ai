
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'

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

    // Parse request body - support both legacy (systemPrompt) and new (staticPrompt + userContext) formats
    const body = await req.json();
    const { 
      userMessage, 
      systemPrompt,
      staticPrompt,
      userContext,
      conversationHistory = []
    } = body;

    if (!userMessage || (!systemPrompt && !staticPrompt)) {
      throw new Error('userMessage and system prompt are required');
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

    // Sonnet-only model configuration (no fallback - quality is non-negotiable)
    const modelConfig = {
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      inputCostPer1M: 0.000003,
      outputCostPer1M: 0.000015
    };

    // Helper: Call Anthropic with retry logic and exponential backoff
    const callAnthropicWithRetry = async (
      modelConfig: { model: string; max_tokens: number },
      messages: any[],
      systemBlocks: any[],
      maxRetries: number = 3
    ) => {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01',
              'anthropic-beta': 'prompt-caching-2024-07-31',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              model: modelConfig.model,
              max_tokens: modelConfig.max_tokens,
              messages: messages,
              system: systemBlocks
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            return await response.json();
          }

          // Handle retryable errors with exponential backoff
          if (response.status === 429 || response.status === 529 || response.status === 503) {
            const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
            console.log(`Retryable error ${response.status} on ${modelConfig.model}, attempt ${attempt + 1}/${maxRetries}, waiting ${waitTime}ms`);
            
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }

          // Non-retryable errors or final retry failed
          const errorText = await response.text();
          console.error(`API error ${response.status} on ${modelConfig.model}:`, errorText);
          throw new Error(`API_ERROR_${response.status}`);

        } catch (err) {
          // Handle timeout
          if (err.name === 'AbortError') {
            console.error(`Request timeout on ${modelConfig.model}, attempt ${attempt + 1}/${maxRetries}`);
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('REQUEST_TIMEOUT');
          }
          
          // Last attempt or non-retryable error
          if (attempt === maxRetries - 1) {
            throw err;
          }
        }
      }
      
      throw new Error('MAX_RETRIES_EXCEEDED');
    };

    // Truncate conversation history to last 15 messages
    const truncateHistory = (history: any[], maxMessages: number = 15) => {
      if (history.length <= maxMessages) return history;
      return history.slice(-maxMessages);
    };

    // Truncate history and build messages
    const truncatedHistory = truncateHistory(conversationHistory);
    const messages = [
      ...truncatedHistory,
      { role: 'user', content: userMessage }
    ];

    // Determine system prompt format
    const systemBlocks = staticPrompt && userContext
      ? [
          // New format: static prompt (cached) + dynamic user context (not cached)
          {
            type: "text",
            text: staticPrompt,
            cache_control: { type: "ephemeral" }
          },
          {
            type: "text",
            text: userContext
          }
        ]
      : [
          // Legacy format: single combined prompt (cached)
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" }
          }
        ];

    // DIAGNOSTIC: Hash the static prompt to verify consistency across requests
    if (staticPrompt) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(staticPrompt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
        console.log(`[CACHE DEBUG] Static prompt hash: ${hashHex}, length: ${staticPrompt.length} chars, ${data.length} bytes`);
      } catch (hashError) {
        console.error('[CACHE DEBUG] Failed to hash static prompt:', hashError);
      }
    }

    // Call Sonnet with retries (no Haiku fallback - quality is non-negotiable)
    console.log(`Calling Anthropic API with model: ${modelConfig.model}...`);
    const data = await callAnthropicWithRetry(modelConfig, messages, systemBlocks, 5);
    console.log(`Model ${modelConfig.model} succeeded`);
    console.log('Anthropic API response received successfully')
    
    if (data.content && data.content[0] && data.content[0].text) {
      // Log token usage with cache metrics
      try {
        const inputTokens = data.usage?.input_tokens || 0;
        const outputTokens = data.usage?.output_tokens || 0;
        const cacheCreationTokens = data.usage?.cache_creation_input_tokens || 0;
        const cacheReadTokens = data.usage?.cache_read_input_tokens || 0;
        const model = modelConfig.model;
        
        // Calculate cost with cache pricing
        // Cache writes: 25% more expensive than base input
        // Cache reads: 90% cheaper than base input (only 10% cost)
        const baseInputCost = inputTokens * modelConfig.inputCostPer1M;
        const cacheWriteCost = cacheCreationTokens * modelConfig.inputCostPer1M * 1.25;
        const cacheReadCost = cacheReadTokens * modelConfig.inputCostPer1M * 0.10;
        const outputCost = outputTokens * modelConfig.outputCostPer1M;
        
        const estimatedCost = baseInputCost + cacheWriteCost + cacheReadCost + outputCost;
        
        // Log cache performance
        const totalInputTokens = inputTokens + cacheCreationTokens + cacheReadTokens;
        console.log(`Cache stats: ${cacheCreationTokens} created, ${cacheReadTokens} read out of ${totalInputTokens} total input tokens`);
        if (cacheReadTokens > 0) {
          const savingsPercent = ((cacheReadTokens * 0.9) / totalInputTokens * 100).toFixed(1);
          console.log(`Cache savings: ~${savingsPercent}% on input tokens`);
        }
        
        const { error: tokenError } = await supabaseService
          .from('user_token_usage')
          .insert({
            user_id: user.id,
            model: model,
            input_tokens: totalInputTokens,
            output_tokens: outputTokens,
            estimated_cost: estimatedCost
          });
        
        if (tokenError) {
          console.error('Failed to log token usage:', tokenError);
        } else {
          console.log(`Logged token usage: ${totalInputTokens} input (${cacheReadTokens} cached), ${outputTokens} output, $${estimatedCost.toFixed(6)} cost`);
        }

        // Log cache metrics for admin monitoring
        if (cacheCreationTokens > 0 || cacheReadTokens > 0) {
          // Calculate cost savings from cache reads (90% cheaper than base input)
          const cacheSavings = cacheReadTokens * modelConfig.inputCostPer1M * 0.9;
          
          const { error: cacheError } = await supabaseService
            .from('cache_metrics')
            .insert({
              user_id: user.id,
              model: model,
              cache_creation_tokens: cacheCreationTokens,
              cache_read_tokens: cacheReadTokens,
              total_input_tokens: totalInputTokens,
              estimated_cost_savings: cacheSavings
            });
          
          if (cacheError) {
            console.error('Failed to log cache metrics:', cacheError);
          }
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
    
    // User-friendly error messages
    let sanitizedError: string;
    let statusCode = 500;
    
    if (error.message === 'RATE_LIMIT') {
      sanitizedError = 'kai is busy right now—try again in a few seconds';
      statusCode = 429;
    } else if (error.message === 'SERVICE_OVERLOAD') {
      sanitizedError = 'kai is taking a moment... please try again';
      statusCode = 503;
    } else if (error.message === 'REQUEST_TIMEOUT') {
      sanitizedError = 'request took too long—please try again';
      statusCode = 504;
    } else if (error.message?.includes('Authentication') || error.message?.includes('Invalid authentication')) {
      sanitizedError = 'Authentication failed';
      statusCode = 401;
    } else {
      sanitizedError = 'kai is temporarily unavailable—please try again in a moment';
    }
    
    return new Response(
      JSON.stringify({ 
        error: sanitizedError
      }),
      { 
        status: statusCode,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
