import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { WaitlistConfirmationEmail } from "./_templates/waitlist-confirmation.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitlistRequest {
  email: string;
  name?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WaitlistRequest = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`Sending waitlist confirmation to: ${email}`);

    const html = await renderAsync(
      React.createElement(WaitlistConfirmationEmail, { name: name || undefined })
    );

    const { error } = await resend.emails.send({
      from: "heartlines <noreply@heartlines.ai>",
      to: [email],
      subject: "you're on the list ✨",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Waitlist confirmation sent successfully to: ${email}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in confirm-waitlist:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
