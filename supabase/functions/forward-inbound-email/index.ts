import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const webhookSecret = Deno.env.get("RESEND_WEBHOOK_SECRET") as string;

const FORWARD_TO_EMAILS = [
  "sam@heartlines.ai",
  "swortman1994@gmail.com"
];

interface ResendEmailReceivedEvent {
  type: "email.received";
  created_at: string;
  data: {
    to: string;
    from: string;
    subject: string;
    html: string;
    text: string;
    headers: Record<string, string>;
    reply_to?: string;
    email_id: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("📧 Received webhook request");

  if (req.method !== "POST") {
    console.log("❌ Invalid method:", req.method);
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Get the raw payload and headers
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);

    console.log("🔐 Verifying webhook signature");
    
    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    let event: ResendEmailReceivedEvent;
    
    try {
      event = wh.verify(payload, headers) as ResendEmailReceivedEvent;
    } catch (error) {
      console.error("❌ Webhook verification failed:", error);
      return new Response("Webhook verification failed", { status: 401 });
    }

    console.log("✅ Webhook verified successfully");
    console.log("📨 Email event:", {
      type: event.type,
      to: event.data.to,
      from: event.data.from,
      subject: event.data.subject,
      emailId: event.data.email_id
    });

    // Check if this is an email.received event
    if (event.type !== "email.received") {
      console.log("⏭️ Ignoring non-email event:", event.type);
      return new Response(JSON.stringify({ message: "Event ignored" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { to, from, subject, html, text, reply_to } = event.data;

    // Determine which mailbox received this email
    const mailbox = to.toLowerCase().includes("support") 
      ? "support@heartlines.ai" 
      : "partnerships@heartlines.ai";

    console.log(`📬 Forwarding email from ${mailbox} to personal addresses`);

    // Forward the email to all recipients
    const forwardPromises = FORWARD_TO_EMAILS.map(async (recipient) => {
      try {
        const result = await resend.emails.send({
          from: `${mailbox} <onboarding@resend.dev>`,
          to: [recipient],
          subject: `[Forwarded from ${mailbox}] ${subject}`,
          html: `
            <div style="border-left: 4px solid #ff6b6b; padding-left: 16px; margin-bottom: 24px; color: #666;">
              <p style="margin: 4px 0;"><strong>From:</strong> ${from}</p>
              <p style="margin: 4px 0;"><strong>To:</strong> ${mailbox}</p>
              <p style="margin: 4px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            ${html || `<pre style="white-space: pre-wrap; font-family: sans-serif;">${text}</pre>`}
          `,
          reply_to: reply_to || from,
        });

        console.log(`✅ Forwarded to ${recipient}:`, result.data?.id);
        return { success: true, recipient, id: result.data?.id };
      } catch (error) {
        console.error(`❌ Failed to forward to ${recipient}:`, error);
        return { success: false, recipient, error: error.message };
      }
    });

    const results = await Promise.all(forwardPromises);
    const successCount = results.filter(r => r.success).length;
    
    console.log(`📊 Forwarding complete: ${successCount}/${FORWARD_TO_EMAILS.length} successful`);

    return new Response(
      JSON.stringify({ 
        message: "Email forwarded successfully",
        results,
        successCount,
        totalRecipients: FORWARD_TO_EMAILS.length
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("❌ Error processing webhook:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);
