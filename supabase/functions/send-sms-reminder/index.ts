import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from '../_shared/cors.ts';

function normalizeToE164(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("+")) return digits; // already E.164
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits; // US with country code
  if (digits.length === 10) return "+1" + digits; // assume US default
  return null;
}

async function sendTwilioSMS(
  to: string,
  body: string,
  accountSid: string,
  authToken: string,
  fromNumber?: string,
  messagingServiceSid?: string
) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const form = new URLSearchParams();
  form.set("To", to);
  form.set("Body", body);
  if (messagingServiceSid) {
    form.set("MessagingServiceSid", messagingServiceSid);
  } else if (fromNumber) {
    form.set("From", fromNumber);
  } else {
    throw new Error("Missing TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Twilio error ${res.status}: ${text}`);
  }

  return res.json();
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT token and get authenticated user
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });

    const { data: { user }, error: authError } = await authSupabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role key for database operations
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
    const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || (!TWILIO_FROM_NUMBER && !TWILIO_MESSAGING_SERVICE_SID)) {
      return new Response(
        JSON.stringify({
          error:
            "Twilio secrets missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and either TWILIO_FROM_NUMBER or TWILIO_MESSAGING_SERVICE_SID.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { reminderIds } = await req.json();

    if (!reminderIds || !Array.isArray(reminderIds) || reminderIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid reminder IDs provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch reminders belonging to the authenticated user only
    const { data: reminders, error: remindersError } = await supabase
      .from("user_reminders")
      .select("id, user_id, reminder_text, reminder_time, last_sent_at")
      .in("id", reminderIds)
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (remindersError) {
      console.error("Error fetching reminders:", remindersError);
      throw remindersError;
    }

    const userIds = Array.from(new Set((reminders || []).map((r: any) => r.user_id)));

    // Fetch phone numbers
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, phone_number")
      .in("user_id", userIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    const phoneByUser = new Map<string, string>();
    for (const p of profiles || []) {
      if (p.phone_number) phoneByUser.set(p.user_id, p.phone_number);
    }

    const results: any[] = [];

    for (const reminder of reminders || []) {
      try {
        const rawPhone = phoneByUser.get(reminder.user_id);
        const to = rawPhone ? normalizeToE164(rawPhone) : null;
        if (!to) {
          results.push({ reminderId: reminder.id, status: "skipped", error: "No valid phone number" });
          continue;
        }

        const message = `RealTalk: ${reminder.reminder_text}`;

        await sendTwilioSMS(
          to,
          message,
          TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN,
          TWILIO_FROM_NUMBER || undefined,
          TWILIO_MESSAGING_SERVICE_SID || undefined
        );

        // Update last_sent_at
        const { error: updateError } = await supabase
          .from("user_reminders")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", reminder.id);
        if (updateError) console.error("Failed updating last_sent_at:", updateError);

        results.push({ reminderId: reminder.id, status: "sent" });
      } catch (smsError: any) {
        console.error(`Failed to send SMS for reminder ${reminder.id}:`, smsError);
        results.push({ reminderId: reminder.id, status: "failed", error: smsError?.message || String(smsError) });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-sms-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
