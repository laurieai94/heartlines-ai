import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
const cronSecret = Deno.env.get('CRON_SECRET_KEY')

Deno.serve(async (req) => {
  console.log('🏥 Health check triggered')

  try {
    // Verify cron secret
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (token !== cronSecret) {
      console.error('❌ Unauthorized: Invalid cron secret')
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test Anthropic API with minimal request
    console.log('Testing Anthropic API...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for health check

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'hi' }]
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Anthropic API error: ${response.status}`, errorText)
      
      // Determine error type
      let errorType = 'api_error'
      let errorMessage = errorText
      
      if (response.status === 400 && errorText.includes('credit balance')) {
        errorType = 'credit_exhausted'
        errorMessage = 'Anthropic credit balance exhausted'
      } else if (response.status === 429) {
        errorType = 'rate_limit'
        errorMessage = 'Rate limit exceeded'
      } else if (response.status === 529 || response.status === 503) {
        errorType = 'api_error'
        errorMessage = 'Anthropic API overloaded or unavailable'
      }

      // Trigger alert
      console.log(`🚨 Triggering ${errorType} alert...`)
      
      await supabase.functions.invoke('api-error-alert', {
        body: {
          error_type: errorType,
          error_code: response.status,
          error_message: errorMessage,
        }
      })

      return new Response(JSON.stringify({ 
        status: 'unhealthy',
        error: errorType,
        code: response.status
      }), {
        status: 200, // Return 200 so cron doesn't retry immediately
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('✅ Anthropic API healthy')
    
    // Check for recent failures in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentFailures, count } = await supabase
      .from('api_request_metrics')
      .select('*', { count: 'exact' })
      .eq('success', false)
      .gte('created_at', oneHourAgo)

    const failureCount = count || 0
    
    if (failureCount >= 5) {
      console.log(`⚠️ ${failureCount} failures in last hour, sending alert`)
      
      await supabase.functions.invoke('api-error-alert', {
        body: {
          error_type: 'consecutive_failures',
          error_message: `${failureCount} API failures in the last hour`,
          affected_users: new Set(recentFailures?.map(f => f.user_id)).size
        }
      })
    }

    return new Response(JSON.stringify({ 
      status: 'healthy',
      recentFailures: failureCount,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Health check error:', error)
    
    // If health check itself fails, that's critical
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    await supabase.functions.invoke('api-error-alert', {
      body: {
        error_type: 'api_error',
        error_message: `Health check failed: ${error.message}`,
      }
    })

    return new Response(JSON.stringify({ 
      status: 'error',
      message: error.message 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
