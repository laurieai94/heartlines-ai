
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { reminderIds } = await req.json()
    
    if (!reminderIds || !Array.isArray(reminderIds)) {
      throw new Error('Invalid reminder IDs provided')
    }

    // Fetch reminders and user phone numbers
    const { data: reminders, error } = await supabase
      .from('user_reminders')
      .select(`
        id,
        reminder_text,
        user_id,
        profiles!inner(phone_number)
      `)
      .in('id', reminderIds)
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching reminders:', error)
      throw error
    }

    // Check if Twilio credentials are available
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER')

    const results = []
    
    for (const reminder of reminders || []) {
      try {
        const phoneNumber = reminder.profiles?.phone_number
        if (!phoneNumber) {
          console.log(`No phone number for user ${reminder.user_id}`)
          results.push({
            reminderId: reminder.id,
            status: 'failed',
            error: 'No phone number on file'
          })
          continue
        }

        const smsMessage = `RealTalk: ${reminder.reminder_text} 💙`
        
        if (twilioSid && twilioToken && twilioPhone) {
          // Send actual SMS via Twilio
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`
          
          const formData = new FormData()
          formData.append('To', phoneNumber)
          formData.append('From', twilioPhone)
          formData.append('Body', smsMessage)

          const twilioResponse = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`
            },
            body: formData
          })

          if (twilioResponse.ok) {
            console.log(`SMS sent successfully to ${phoneNumber}`)
            results.push({
              reminderId: reminder.id,
              status: 'sent',
              message: smsMessage,
              phone: phoneNumber
            })
          } else {
            const errorData = await twilioResponse.text()
            console.error(`Twilio error: ${errorData}`)
            results.push({
              reminderId: reminder.id,
              status: 'failed',
              error: 'SMS delivery failed'
            })
          }
        } else {
          // Log what would be sent (for testing without Twilio)
          console.log(`Would send SMS to ${phoneNumber}: "${smsMessage}"`)
          results.push({
            reminderId: reminder.id,
            status: 'simulated',
            message: smsMessage,
            phone: phoneNumber
          })
        }
      } catch (smsError) {
        console.error(`Failed to send SMS for reminder ${reminder.id}:`, smsError)
        results.push({
          reminderId: reminder.id,
          status: 'failed',
          error: smsError.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        message: `Processed ${results.length} reminders`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in send-sms-reminder function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
