import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { ApiErrorAlertEmail } from './_templates/api-error-alert.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const ADMIN_EMAIL = 'swortman1994@gmail.com'
const DASHBOARD_URL = 'https://heartlines.ai/admin'
const ANTHROPIC_BILLING_URL = 'https://console.anthropic.com/settings/billing'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AlertRequest {
  error_type: 'credit_exhausted' | 'rate_limit' | 'api_error' | 'consecutive_failures' | 'crisis_handoff';
  error_code?: number;
  error_message?: string;
  affected_users?: number;
  user_id?: string;
  detection_phrase?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('🚨 API Error Alert triggered')

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: AlertRequest = await req.json()
    const { error_type, error_code, error_message, affected_users, user_id, detection_phrase } = body

    console.log(`Alert type: ${error_type}, code: ${error_code}, message: ${error_message}`)

    // Check debounce - avoid spam
    const { data: alertState } = await supabase
      .from('cache_alert_state')
      .select('*')
      .eq('alert_type', `api_error_${error_type}`)
      .single()

    const lastSentAt = alertState?.last_sent_at
    if (lastSentAt) {
      const minutesSinceLastAlert = (Date.now() - new Date(lastSentAt).getTime()) / (1000 * 60)
      // Crisis alerts: 5 min debounce, others: 30 min
      const debounceMinutes = error_type === 'crisis_handoff' ? 5 : 30
      
      if (minutesSinceLastAlert < debounceMinutes) {
        console.log(`⏳ Alert debounced (sent ${minutesSinceLastAlert.toFixed(1)} min ago)`)
        return new Response(JSON.stringify({ 
          message: 'Alert debounced',
          minutesSinceLastAlert 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Get recent failure count for context
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentFailures } = await supabase
      .from('api_request_metrics')
      .select('*', { count: 'exact' })
      .eq('success', false)
      .gte('created_at', oneHourAgo)

    const failureCount = recentFailures?.length || 0
    const affectedUsersCount = affected_users || new Set(recentFailures?.map(f => f.user_id)).size

    // Determine subject and urgency
    let subject: string
    let urgency: 'critical' | 'warning' | 'info'
    
    switch (error_type) {
      case 'credit_exhausted':
        subject = '🚨 [CRITICAL] Anthropic Credit Balance Exhausted'
        urgency = 'critical'
        break
      case 'rate_limit':
        subject = '⚠️ [WARNING] Anthropic Rate Limits Hit'
        urgency = 'warning'
        break
      case 'consecutive_failures':
        subject = '🚨 [CRITICAL] Multiple API Failures Detected'
        urgency = 'critical'
        break
      case 'crisis_handoff':
        subject = '🆘 [URGENT] Mental Health Crisis Handoff Triggered'
        urgency = 'critical'
        break
      default:
        subject = `⚠️ [WARNING] API Error ${error_code || ''}`
        urgency = 'warning'
    }

    // Render email
    const html = await renderAsync(
      React.createElement(ApiErrorAlertEmail, {
        errorType: error_type,
        errorCode: error_code,
        errorMessage: error_message || 'Unknown error',
        failureCount,
        affectedUsers: affectedUsersCount,
        urgency,
        dashboardUrl: DASHBOARD_URL,
        anthropicBillingUrl: ANTHROPIC_BILLING_URL,
        userId: user_id,
        detectionPhrase: detection_phrase,
      })
    )

    // Send email
    const { error: emailError } = await resend.emails.send({
      from: 'Heartlines Alerts <noreply@heartlines.ai>',
      to: [ADMIN_EMAIL],
      subject,
      html,
    })

    if (emailError) {
      console.error('❌ Error sending email:', emailError)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Update or insert alert state for debounce
    const { error: upsertError } = await supabase
      .from('cache_alert_state')
      .upsert({
        alert_type: `api_error_${error_type}`,
        last_sent_at: new Date().toISOString(),
        last_value: error_code || 0,
      }, { onConflict: 'alert_type' })

    if (upsertError) {
      console.error('⚠️ Error updating alert state:', upsertError)
    }

    console.log('✅ Alert email sent successfully')
    return new Response(JSON.stringify({ 
      message: 'Alert sent',
      errorType: error_type,
      emailSent: true
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
