import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import React from 'npm:react@18.3.1'
import { CriticalAlertEmail } from './_templates/critical-alert.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const cronSecret = Deno.env.get('CRON_SECRET_KEY') as string

const ADMIN_EMAIL = 'swortman1994@gmail.com'
const DASHBOARD_URL = 'https://heartlines.ai/admin'

const CRITICAL_THRESHOLD = 50 // Cache hit rate %
const MIN_REQUESTS = 10 // Minimum requests to trigger alert
const DEBOUNCE_HOURS = 1 // Hours between alerts

Deno.serve(async (req) => {
  console.log('🔔 Cache alert check triggered')

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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Query cache metrics from last 24 hours
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_cache_summary')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)

    if (metricsError) {
      console.error('❌ Error fetching cache metrics:', metricsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!metrics || metrics.length === 0) {
      console.log('ℹ️ No cache metrics available yet')
      return new Response(JSON.stringify({ message: 'No metrics available' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const latestMetric = metrics[0]
    const cacheHitRate = latestMetric.cache_hit_rate_percent || 0
    const requestCount = latestMetric.request_count || 0

    console.log(`📊 Cache hit rate: ${cacheHitRate.toFixed(1)}%, Requests: ${requestCount}`)

    // Check if alert conditions are met
    if (cacheHitRate >= CRITICAL_THRESHOLD) {
      console.log('✅ Cache hit rate is healthy, no alert needed')
      return new Response(JSON.stringify({ 
        message: 'Cache hit rate healthy',
        currentRate: cacheHitRate 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (requestCount < MIN_REQUESTS) {
      console.log('ℹ️ Insufficient requests to trigger alert')
      return new Response(JSON.stringify({ 
        message: 'Insufficient data',
        requestCount 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check debounce - has an alert been sent recently?
    const { data: alertState, error: stateError } = await supabase
      .from('cache_alert_state')
      .select('*')
      .eq('alert_type', 'critical_cache_hit_rate')
      .single()

    if (stateError && stateError.code !== 'PGRST116') {
      console.error('❌ Error fetching alert state:', stateError)
      return new Response(JSON.stringify({ error: 'Failed to fetch alert state' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const lastSentAt = alertState?.last_sent_at
    if (lastSentAt) {
      const hoursSinceLastAlert = (Date.now() - new Date(lastSentAt).getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastAlert < DEBOUNCE_HOURS) {
        console.log(`⏳ Alert debounced (sent ${hoursSinceLastAlert.toFixed(1)}h ago)`)
        return new Response(JSON.stringify({ 
          message: 'Alert debounced',
          hoursSinceLastAlert 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Calculate cost impact (rough estimate)
    // Cache miss costs 10x more than cache hit for prompt caching
    const missedCacheSavings = (requestCount * (100 - cacheHitRate) / 100) * 0.05 // $0.05 per missed cache
    
    console.log('🚨 CRITICAL: Sending alert email')

    // Render email
    const html = await renderAsync(
      React.createElement(CriticalAlertEmail, {
        currentRate: cacheHitRate,
        threshold: CRITICAL_THRESHOLD,
        requestCount,
        model: latestMetric.model || 'claude-3-5-sonnet-20241022',
        costImpact: missedCacheSavings,
        dashboardUrl: DASHBOARD_URL,
      })
    )

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'Heartlines Alerts <noreply@heartlines.ai>',
      to: [ADMIN_EMAIL],
      subject: '🚨 [CRITICAL] Cache Hit Rate Below 50%',
      html,
    })

    if (emailError) {
      console.error('❌ Error sending email:', emailError)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update alert state
    const { error: updateError } = await supabase
      .from('cache_alert_state')
      .update({
        last_sent_at: new Date().toISOString(),
        last_value: cacheHitRate,
      })
      .eq('alert_type', 'critical_cache_hit_rate')

    if (updateError) {
      console.error('⚠️ Error updating alert state:', updateError)
      // Don't fail the request, email was sent successfully
    }

    console.log('✅ Alert email sent successfully')
    return new Response(JSON.stringify({ 
      message: 'Alert sent',
      currentRate: cacheHitRate,
      emailSent: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
