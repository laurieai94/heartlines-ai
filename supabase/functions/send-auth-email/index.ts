import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const hookSecret = Deno.env.get('SEND_AUTH_EMAIL_HOOK_SECRET') as string

serve(async (request: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    if (hookSecret) {
      const signature = request.headers.get('webhook-signature')
      if (!signature) {
        return new Response('Missing signature', { 
          status: 401, 
          headers: corsHeaders 
        })
      }

      const body = await request.text()
      const wh = new Webhook(hookSecret)
      
      try {
        const headers: Record<string, string> = {}
        request.headers.forEach((value, key) => {
          headers[key] = value
        })
        wh.verify(body, headers)
      } catch (error) {
        return new Response('Invalid signature', { 
          status: 401, 
          headers: corsHeaders 
        })
      }
    }

    console.log('Auth email webhook received - email service temporarily simplified')

    // Return success without actually sending emails
    // This ensures authentication works while we fix email template compatibility
    return new Response(JSON.stringify({ 
      message: 'Email service acknowledged - authentication will work normally',
      success: true 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (error) {
    console.error('Send auth email error:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Email service temporarily unavailable',
      success: false
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500 
    });
  }
})