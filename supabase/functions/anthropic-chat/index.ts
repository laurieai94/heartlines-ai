
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getCorsHeaders } from '../_shared/cors.ts'

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  console.log(`[CORS] Request from origin: ${origin || 'none'}`);
  console.log(`[CORS] Method: ${req.method}`);
  console.log(`[CORS] Headers being set:`, corsHeaders);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Handling OPTIONS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    console.log('Edge function called, checking API key...')
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment variables')
      throw new Error('ANTHROPIC_API_KEY not found in environment variables')
    }

    console.log('API key found, parsing request body...')
    const { userMessage, systemPrompt, conversationHistory = [] } = await req.json()

    if (!userMessage || !systemPrompt) {
      throw new Error('userMessage and systemPrompt are required')
    }

    console.log('Processing chat request...')

    const messages = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]

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
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: messages,
        system: systemPrompt
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
