import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  notified: boolean;
  priority_code: string | null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { batch_size = 50 } = await req.json().catch(() => ({}));

    console.log("[notify-waitlist] Starting notification batch, size:", batch_size);

    // First, deactivate waitlist
    const { error: updateLimitsError } = await supabase
      .from("launch_limits")
      .update({ waitlist_active: false, updated_at: new Date().toISOString() })
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all rows

    if (updateLimitsError) {
      console.error("[notify-waitlist] Failed to deactivate waitlist:", updateLimitsError);
    }

    // Get oldest unnotified waitlist entries
    const { data: waitlistEntries, error: fetchError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("notified", false)
      .order("created_at", { ascending: true })
      .limit(batch_size);

    if (fetchError) {
      console.error("[notify-waitlist] Error fetching waitlist:", fetchError);
      throw new Error("Failed to fetch waitlist entries");
    }

    if (!waitlistEntries || waitlistEntries.length === 0) {
      console.log("[notify-waitlist] No pending waitlist entries");
      return new Response(
        JSON.stringify({ message: "No pending waitlist entries", notified: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[notify-waitlist] Processing", waitlistEntries.length, "entries");

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (const entry of waitlistEntries as WaitlistEntry[]) {
      try {
        // Generate priority code for this user
        const priorityCode = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Update waitlist entry with priority code
        const { error: updateError } = await supabase
          .from("waitlist")
          .update({
            notified: true,
            priority_code: priorityCode,
            priority_expires_at: expiresAt.toISOString()
          })
          .eq("id", entry.id);

        if (updateError) {
          console.error("[notify-waitlist] Failed to update entry:", updateError);
          results.failed++;
          results.errors.push(`Failed to update ${entry.email}`);
          continue;
        }

        // Send email
        const signupUrl = `https://heartlines.ai/signup?priority=${priorityCode}`;
        
        const emailResponse = await resend.emails.send({
          from: "Heartlines <noreply@heartlines.ai>",
          to: [entry.email],
          subject: "You're in! 💕 Your spot at Heartlines is ready",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="color-scheme" content="light only">
              <meta name="supported-color-schemes" content="light only">
            </head>
            <body style="margin: 0; padding: 0; background-color: #660010; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #660010;">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: 0 auto;">
                      
                      <!-- Logo -->
                      <tr>
                        <td align="center" style="padding-bottom: 30px;">
                          <img src="https://relqmhrzyqckoaebscgx.supabase.co/storage/v1/object/public/heartlines%20color/heartlines-text-pink.png" alt="heartlines" width="180" style="display: block; max-width: 180px; height: auto;">
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border-radius: 24px; padding: 40px 30px; border: 1px solid rgba(255,255,255,0.1);">
                          
                          <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #ffffff; text-align: center;">
                            you're in! 🎉
                          </h1>
                          
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.85); text-align: center;">
                            ${entry.name ? `hey ${entry.name.split(' ')[0].toLowerCase()},` : 'hey there,'}<br><br>
                            we've opened up spots and you're off the waitlist! your priority link is ready.
                          </p>
                          
                          <!-- CTA Button -->
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="padding: 20px 0;">
                                <a href="${signupUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 50%, #FFB4B4 100%); color: #1a0a0a; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 40px; border-radius: 50px; box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);">
                                  claim your spot →
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.6); text-align: center;">
                            this priority link expires in 7 days.<br>
                            can't wait to have you!
                          </p>
                          
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="padding-top: 30px; text-align: center;">
                          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4);">
                            © ${new Date().getFullYear()} heartlines · relationship ai that actually gets it
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });

        console.log("[notify-waitlist] Email sent to:", entry.email, emailResponse);
        results.success++;

      } catch (emailError) {
        console.error("[notify-waitlist] Email error for", entry.email, ":", emailError);
        results.failed++;
        results.errors.push(`Email failed for ${entry.email}: ${emailError.message}`);
      }
    }

    console.log("[notify-waitlist] Complete. Success:", results.success, "Failed:", results.failed);

    return new Response(JSON.stringify({
      message: "Waitlist notification complete",
      notified: results.success,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[notify-waitlist] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
