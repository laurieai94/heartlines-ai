import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { PasswordResetEmail } from './_templates/password-reset.tsx'
import { MagicLinkEmail } from './_templates/magic-link.tsx'
import { EmailConfirmationEmail } from './_templates/email-confirmation.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_AUTH_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const wh = new Webhook(hookSecret)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log('Processing email type:', email_action_type, 'for user:', user.email)

    let html: string
    let subject: string
    let fromEmail: string

    // Determine email template and content based on action type
    switch (email_action_type) {
      case 'recovery':
        html = await renderAsync(
          React.createElement(PasswordResetEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Reset your Heartlines password'
        fromEmail = 'Sam from Heartlines <sam@heartlines.ai>'
        break

      case 'magiclink':
        html = await renderAsync(
          React.createElement(MagicLinkEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Your secure login link for Heartlines'
        fromEmail = 'Sam from Heartlines <sam@heartlines.ai>'
        break

      case 'signup':
      case 'confirmation':
        html = await renderAsync(
          React.createElement(EmailConfirmationEmail, {
            supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
            token,
            token_hash,
            redirect_to,
            email_action_type,
          })
        )
        subject = 'Welcome to Heartlines! Please confirm your email'
        fromEmail = 'Sam from Heartlines <sam@heartlines.ai>'
        break

      default:
        throw new Error(`Unsupported email action type: ${email_action_type}`)
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log(`Successfully sent ${email_action_type} email to ${user.email}`)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('Error in send-auth-email function:', error)
    
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      }),
      {
        status: error.status || 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    )
  }
})