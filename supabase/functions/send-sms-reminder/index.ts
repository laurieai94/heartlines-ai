
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

    const results = []
    
    for (const reminder of reminders || []) {
      try {
        // Here you would integrate with your SMS service (Twilio, etc.)
        // For now, we'll just log the SMS that would be sent
        const smsMessage = `RealTalk: ${reminder.reminder_text} 💙`
        
        console.log(`Would send SMS to user ${reminder.user_id}: "${smsMessage}"`)
        
        // In a real implementation, you'd send the SMS here:
        // await sendSMS(reminder.profiles.phone_number, smsMessage)
        
        results.push({
          reminderId: reminder.id,
          status: 'sent',
          message: smsMessage
        })
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
