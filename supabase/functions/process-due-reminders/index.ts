import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizeToE164(input: string): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (input.startsWith("+")) return input;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length === 10) return "+1" + digits;
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
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

    // Determine current UTC HH:MM:00
    const now = new Date();
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const currentTime = `${hh}:${mm}:00`;

    // Current weekday in lowercase (e.g., 'monday') in UTC
    const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" })
      .format(now)
      .toLowerCase();

    // Fetch due reminders for this minute
    const { data: reminders, error: remindersError } = await supabase
      .from("user_reminders")
      .select("id, user_id, reminder_text, reminder_time, reminder_days, last_sent_at")
      .eq("is_active", true)
      .eq("reminder_time", currentTime);

    if (remindersError) {
      console.error("Error fetching due reminders:", remindersError);
      throw remindersError;
    }

    const dueReminders = (reminders || []).filter((r: any) => {
      // Day filter
      if (r.reminder_days && Array.isArray(r.reminder_days)) {
        if (!r.reminder_days.map((d: string) => d.toLowerCase()).includes(weekday)) return false;
      }
      // Already sent today filter
      if (r.last_sent_at) {
        const last = new Date(r.last_sent_at);
        if (
          last.getUTCFullYear() === now.getUTCFullYear() &&
          last.getUTCMonth() === now.getUTCMonth() &&
          last.getUTCDate() === now.getUTCDate()
        ) {
          return false;
        }
      }
      return true;
    });

    if (dueReminders.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No reminders due this minute" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userIds = Array.from(new Set(dueReminders.map((r: any) => r.user_id)));

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

    for (const reminder of dueReminders) {
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

        const { error: updateError } = await supabase
          .from("user_reminders")
          .update({ last_sent_at: new Date().toISOString() })
          .eq("id", reminder.id);
        if (updateError) {
          console.error("Failed updating last_sent_at:", updateError);
        }

        results.push({ reminderId: reminder.id, status: "sent" });
      } catch (err: any) {
        console.error(`Failed to process reminder ${reminder.id}:`, err);
        results.push({ reminderId: reminder.id, status: "failed", error: err?.message || String(err) });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in process-due-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
