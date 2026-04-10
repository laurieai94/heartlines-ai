
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
    // Track metrics for API health monitoring (declared early for error handlers)
    const requestStartTime = Date.now();
    let retryCount = 0;
    let lastErrorType: string | null = null;
    let lastErrorCode: number | null = null;

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
          case 'glow': return 150;
          case 'vibe': return 300;
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

    // ============ OPENER ROTATOR SYSTEM ============
    
    // Scenario detection: analyze first message to pick appropriate opener category
    const detectScenario = (message: string): string => {
      const lowerMsg = message.toLowerCase();
      
      // Conflict/fight patterns
      if (/\b(fight|fighting|argument|argue|argued|blowup|blow up|yelled|yelling|screaming|screamed)\b/.test(lowerMsg)) {
        return 'conflict';
      }
      // Shutdown/stonewalling patterns
      if (/\b(won't talk|wont talk|silent treatment|shut down|shutdown|stonewalling|disappeared|ignoring me|not responding|ghosted|ghosting)\b/.test(lowerMsg)) {
        return 'shutdown';
      }
      // Spiral/anxiety patterns
      if (/\b(spiraling|spiral|can't stop thinking|cant stop thinking|anxious|anxiety|obsessing|overthinking|panic)\b/.test(lowerMsg)) {
        return 'spiral';
      }
      // Betrayal patterns
      if (/\b(cheated|cheating|affair|lied|lying|found out|betrayed|betrayal|trust broken|unfaithful)\b/.test(lowerMsg)) {
        return 'betrayal';
      }
      // Jealousy patterns
      if (/\b(jealous|jealousy|insecure|threatened|suspicious|ex girlfriend|ex boyfriend|ex wife|ex husband)\b/.test(lowerMsg)) {
        return 'jealousy';
      }
      // Intimacy/sexuality/identity patterns
      if (/\b(sex|intimacy|physical|transition|transitioning|surgery|non-binary|nonbinary|gender|attraction|attracted|desire|libido)\b/.test(lowerMsg)) {
        return 'intimacy';
      }
      // Family patterns
      if (/\b(parents|family|in-laws|inlaws|mother|father|mom|dad|his family|her family|their family)\b/.test(lowerMsg)) {
        return 'family';
      }
      
      return 'default';
    };

    // Scenario to category mapping - ALWAYS use direct questions only
    const scenarioCategoryMapping: Record<string, string[]> = {
      conflict: ['direct'],
      shutdown: ['direct'],
      spiral: ['direct'],
      betrayal: ['direct'],
      jealousy: ['direct'],
      intimacy: ['direct'],
      family: ['direct'],
      default: ['direct'],
    };

    // Banned phrases that should never appear in responses
    // Note: "does that land" is ALLOWED in Phase 2 reflections only, not banned globally
    const bannedPhrases = [
      "oh wow", "that's really hard", "you got this",
      "that's a lot", "that's heavy", "i hear that", "that makes sense",
      "that makes total sense", "okay. so", "got it. so", "so you're saying",
      "so they're saying"
    ];

    // DIRECT question-only openers - no validation, no preamble
    const openerLibrary = {
      direct: [
        "when did it tip?",
        "what was the spark?",
        "what happened right after?",
        "what went through your body in that moment?",
        "was this the first time this pattern showed up?",
        "what did you do next?",
        "how did they respond when you called it out?",
        "did it feel intentional or careless?",
        "when they said that—did it feel like deflection or taking responsibility?",
        "did they say this in front of others or just to you?",
      ],
    };

    // Get user's recent openers (last 10 sessions)
    const { data: recentOpeners } = await supabaseService
      .from('kai_opener_history')
      .select('opener_text')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const recentOpenerTexts = recentOpeners?.map(r => r.opener_text) || [];

    // Detect scenario from user's message
    const detectedScenario = detectScenario(userMessage);
    console.log(`[OPENER] Detected scenario: ${detectedScenario}`);

    // Select category based on scenario mapping (not random!)
    const appropriateCategories = scenarioCategoryMapping[detectedScenario];
    const selectedCategory = appropriateCategories[Math.floor(Math.random() * appropriateCategories.length)];
    const categoryOpeners = openerLibrary[selectedCategory as keyof typeof openerLibrary];
    
    // Filter out recently used openers
    const availableOpeners = categoryOpeners.filter(o => !recentOpenerTexts.includes(o));
    const selectedOpener = availableOpeners.length > 0 
      ? availableOpeners[Math.floor(Math.random() * availableOpeners.length)]
      : categoryOpeners[Math.floor(Math.random() * categoryOpeners.length)]; // fallback if all used

    console.log(`[OPENER] Selected: "${selectedOpener}" from category: ${selectedCategory} (scenario: ${detectedScenario})`);

    // Check if this is the first AI response (no assistant messages in history yet)
    // Note: Client includes the user's current message in history, so we check for assistant messages, not empty array
    const isFirstResponse = conversationHistory.filter((msg: any) => msg.role === 'assistant').length === 0;
    
    // Inject opener instruction into userContext if using new format
    let enhancedUserContext = userContext;
    if (userContext && isFirstResponse) {
      // Brief ack + question - NO full validation sentences
      enhancedUserContext = `${userContext}\n\n**FIRST MESSAGE RULE**: Start with a brief 1-2 word ack ("mm.", "yeah.", "ugh.", "god.") then a question. Suggested question: "${selectedOpener}" — but adapt it to what they just told you. NO full validation sentences ("that's brutal", "that cuts deep", "glad you said it plainly"). Just brief ack + question.`;
    }

    // Sonnet-only model configuration (no fallback - quality is non-negotiable)
    const modelConfig = {
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
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
        if (attempt > 0) retryCount++;
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
              temperature: 0.75,
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
            
            // Track error type for metrics
            lastErrorType = response.status === 429 ? 'rate_limit' : response.status === 529 ? 'overload' : 'service_error';
            lastErrorCode = response.status;
            
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }

          // Non-retryable errors or final retry failed
          const errorText = await response.text();
          console.error(`API error ${response.status} on ${modelConfig.model}:`, errorText);
          
          lastErrorType = 'api_error';
          lastErrorCode = response.status;
          throw new Error(`API_ERROR_${response.status}`);

        } catch (err) {
          // Handle timeout
          if (err.name === 'AbortError') {
            console.error(`Request timeout on ${modelConfig.model}, attempt ${attempt + 1}/${maxRetries}`);
            lastErrorType = 'timeout';
            lastErrorCode = null;
            
            if (attempt < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error('REQUEST_TIMEOUT');
          }
          
          // Last attempt or non-retryable error
          if (attempt === maxRetries - 1) {
            lastErrorType = 'other';
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
    const systemBlocks = staticPrompt && enhancedUserContext
      ? [
          // New format: static prompt (cached) + dynamic user context (not cached)
          {
            type: "text",
            text: staticPrompt,
            cache_control: { type: "ephemeral" }
          },
          {
            type: "text",
            text: enhancedUserContext
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
    console.log('Anthropic API response received successfully');
    
    // Calculate response time
    const responseTimeMs = Date.now() - requestStartTime;
    
    // With extended thinking, response has multiple content blocks (thinking + text)
    // Find the text block specifically
    const textBlock = data.content?.find((block: any) => block.type === 'text');
    if (textBlock && textBlock.text) {
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

        // Log API request metrics for reliability monitoring
        const { error: metricsError } = await supabaseService
          .from('api_request_metrics')
          .insert({
            user_id: user.id,
            model: model,
            response_time_ms: responseTimeMs,
            retry_count: retryCount,
            success: true,
            input_tokens: totalInputTokens,
            output_tokens: outputTokens
          });
        
        if (metricsError) {
          console.error('Failed to log API metrics:', metricsError);
        } else {
          console.log(`Logged API metrics: ${responseTimeMs}ms response time, ${retryCount} retries`);
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

        // Log opener usage for variety tracking (only for first message)
        if (isFirstResponse && selectedOpener) {
          await supabaseService
            .from('kai_opener_history')
            .insert({
              user_id: user.id,
              opener_category: selectedCategory,
              opener_text: selectedOpener,
              scenario_type: detectedScenario
            });
          console.log(`[OPENER] Logged: "${selectedOpener}" (scenario: ${detectedScenario})`);
        }
      } catch (usageErr) {
        console.error('Error incrementing message usage:', usageErr);
      }
      
      // Get the response text
      let responseText = textBlock.text;
      
      // RESPONSE MONITORING: Log if banned phrases appear (don't force openers anymore)
      if (isFirstResponse) {
        const lowerResponse = responseText.toLowerCase();
        
        // Check for banned phrases and log warning
        const hasBannedPhrase = bannedPhrases.some(phrase => lowerResponse.includes(phrase.toLowerCase()));
        if (hasBannedPhrase) {
          console.warn(`[OPENER WARNING] First response contains banned phrase. Original: "${responseText.substring(0, 100)}..."`);
        }
        
        // Log the opener category that was suggested
        console.log(`[OPENER] Suggested: "${selectedOpener}", Response starts with: "${responseText.substring(0, 50)}..."`);
      }
      
      // Enforce lowercase (existing behavior preserved)
      responseText = responseText.toLowerCase();
      
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
    
    // Initialize variables for error handling (may not be defined if error occurs early)
    const errorRequestStartTime = typeof requestStartTime !== 'undefined' ? requestStartTime : Date.now();
    const errorRetryCount = typeof retryCount !== 'undefined' ? retryCount : 0;
    const errorLastErrorType = typeof lastErrorType !== 'undefined' ? lastErrorType : null;
    const errorLastErrorCode = typeof lastErrorCode !== 'undefined' ? lastErrorCode : null;
    
    // Log failed API request metrics
    try {
      const responseTimeMs = Date.now() - errorRequestStartTime;
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
      });
      
      // Get user from token (may fail if auth error)
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabaseService.auth.getUser(token);
        
        if (user) {
          await supabaseService
            .from('api_request_metrics')
            .insert({
              user_id: user.id,
              model: 'claude-sonnet-4-5',
              response_time_ms: responseTimeMs,
              retry_count: errorRetryCount,
              success: false,
              error_type: errorLastErrorType,
              error_code: errorLastErrorCode
            });
          console.log(`Logged failed API metrics: ${responseTimeMs}ms, ${errorRetryCount} retries, ${errorLastErrorType}`);
        }
      }
      
      // TRIGGER ALERT FOR CRITICAL ERRORS
      const errorMessage = error.message || '';
      const shouldAlert = 
        errorMessage.includes('credit balance') ||
        errorMessage.includes('API_ERROR_400') ||
        errorMessage.includes('API_ERROR_429') ||
        errorMessage.includes('API_ERROR_529') ||
        errorMessage.includes('MAX_RETRIES_EXCEEDED');
      
      if (shouldAlert) {
        console.log('🚨 Triggering error alert...');
        
        let alertType = 'api_error';
        if (errorMessage.includes('credit balance') || errorMessage.includes('API_ERROR_400')) {
          alertType = 'credit_exhausted';
        } else if (errorMessage.includes('API_ERROR_429')) {
          alertType = 'rate_limit';
        }
        
        // Fire and forget - don't await to avoid blocking response
        supabaseService.functions.invoke('api-error-alert', {
          body: {
            error_type: alertType,
            error_code: errorLastErrorCode,
            error_message: errorMessage,
          }
        }).catch(alertErr => {
          console.error('Failed to send alert:', alertErr);
        });
      }
    } catch (metricsErr) {
      console.error('Failed to log error metrics:', metricsErr);
    }
    
    // User-friendly error messages
    let sanitizedError: string;
    let statusCode = 500;
    
    if (error.message === 'RATE_LIMIT') {
      sanitizedError = 'kai is busy right now—try again in a few seconds';
      statusCode = 429;
    } else if (error.message === 'SERVICE_OVERLOAD' || error.message === 'API_ERROR_529') {
      // Gen Z fun message for Anthropic 529 overload
      sanitizedError = "ok so claude's servers are having a moment rn 😅 literally everyone is trying to talk to AI at once and they can't keep up. try again in like 30 secs, it usually clears up fast! no cap, this is on their end not ours 💅";
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
