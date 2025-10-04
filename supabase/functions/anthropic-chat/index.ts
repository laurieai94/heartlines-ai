
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

// Crisis keyword detection (Layer 2: Backend Content Monitoring)
const crisisPatterns = {
  suicide: /\b(kill myself|suicide|want to die|end it all|not worth living|better off dead|no reason to live)\b/i,
  selfHarm: /\b(hurt myself|cut myself|harm myself|self harm|self-harm)\b/i,
  abuse: /\b(hits me|beats me|afraid of (him|her|them)|controls everything|won't let me|threatens me)\b/i,
  emergency: /\b(right now|tonight|today|going to)\b/i
};

function detectCrisisContent(message: string): { 
  hasCrisis: boolean; 
  severity: 'high' | 'medium' | 'low' | null;
  types: string[];
} {
  const types: string[] = [];
  let severity: 'high' | 'medium' | 'low' | null = null;
  
  if (crisisPatterns.suicide.test(message)) {
    types.push('suicide');
    severity = 'high';
  }
  if (crisisPatterns.selfHarm.test(message)) {
    types.push('self-harm');
    severity = severity === 'high' ? 'high' : 'medium';
  }
  if (crisisPatterns.abuse.test(message)) {
    types.push('abuse');
    severity = severity ? severity : 'medium';
  }
  if (crisisPatterns.emergency.test(message) && types.length > 0) {
    severity = 'high'; // Escalate if timing words present
  }
  
  return {
    hasCrisis: types.length > 0,
    severity,
    types
  };
}

function buildCrisisResourcesMessage(severity: 'high' | 'medium' | 'low', types: string[]): string {
  const urgentPrefix = severity === 'high' 
    ? "🚨 **If you're in immediate danger, please call 911 or go to your nearest emergency room.**\n\n"
    : "";
    
  const resources = types.includes('suicide') || types.includes('self-harm')
    ? "**988 Suicide & Crisis Lifeline:** Call or text 988 (available 24/7)\n**Crisis Text Line:** Text HOME to 741741\n\n"
    : "";
    
  const abuseResources = types.includes('abuse')
    ? "**National Domestic Violence Hotline:** 1-800-799-7233 (24/7)\n**SMS:** Text START to 88788\n\n"
    : "";
    
  return `${urgentPrefix}I hear that you're going through something really difficult. While I'm here to support you, I'm not equipped to help with crisis situations. Please reach out to these resources:\n\n${resources}${abuseResources}These are confidential services with trained professionals who can help right now.`;
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

    // Detect crisis content in user message (Layer 2)
    const crisisDetection = detectCrisisContent(userMessage);

    // Log concerning conversations (with privacy considerations)
    if (crisisDetection.hasCrisis) {
      console.log(`Crisis content detected for user ${user.id}:`, {
        severity: crisisDetection.severity,
        types: crisisDetection.types,
        timestamp: new Date().toISOString()
      });
      
      // Log to database for review (no message content stored)
      try {
        await supabaseService
          .from('crisis_logs')
          .insert({
            user_id: user.id,
            severity: crisisDetection.severity,
            crisis_types: crisisDetection.types,
            detected_at: new Date().toISOString()
          });
      } catch (logError) {
        console.error('Failed to log crisis detection:', logError);
      }
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
          default: return 50; // free tier
        }
      };

      const messageLimit = getMessageLimit(tier);
      
      // Check if user has exceeded their limit
      if (currentUsage >= messageLimit) {
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
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

    // Enhance system prompt if crisis detected (Layer 2)
    const enhancedSystemPrompt = crisisDetection.hasCrisis
      ? `${systemPrompt}\n\n**CRITICAL SAFETY OVERRIDE:** The user's message contains potential crisis indicators (${crisisDetection.types.join(', ')}). You MUST acknowledge their pain empathetically AND immediately refer them to crisis resources. Do not attempt to provide therapeutic intervention. Your response should validate their feelings briefly, then clearly direct them to professional help.`
      : systemPrompt;

    console.log('Calling Anthropic API with Claude 4...')
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-1-20250805',
        max_tokens: 400,
        messages: messages,
        system: enhancedSystemPrompt
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
      // Log token usage
      try {
        const inputTokens = data.usage?.input_tokens || 0;
        const outputTokens = data.usage?.output_tokens || 0;
        const model = 'claude-opus-4-1-20250805';
        
        // Calculate cost (Claude 4 Opus: $15/1M input, $75/1M output tokens)
        const estimatedCost = (inputTokens * 0.000015) + (outputTokens * 0.000075);
        
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
      
      // Prepend crisis resources to AI response if detected (Layer 2)
      const aiResponse = data.content[0].text;
      const finalResponse = crisisDetection.hasCrisis
        ? `${buildCrisisResourcesMessage(crisisDetection.severity!, crisisDetection.types)}\n\n---\n\n${aiResponse}`
        : aiResponse;

      return new Response(
        JSON.stringify({ response: finalResponse }),
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
