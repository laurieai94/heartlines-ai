import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { SupportNotificationEmail } from "./_templates/support-notification.tsx";
import { UserConfirmationEmail } from "./_templates/user-confirmation.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Simple validation function
const validateContactData = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }
  
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email address');
  } else if (data.email.length > 255) {
    errors.push('Email must be less than 255 characters');
  }
  
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  } else if (data.subject.length > 200) {
    errors.push('Subject must be less than 200 characters');
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  return { valid: errors.length === 0, errors };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const data: ContactRequest = await req.json();
    
    console.log("Contact form submission received:", { 
      name: data.name, 
      email: data.email, 
      subject: data.subject 
    });

    // Validate input
    const validation = validateContactData(data);
    if (!validation.valid) {
      console.error("Validation errors:", validation.errors);
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
    };

    // Render support notification email
    const supportHtml = await renderAsync(
      React.createElement(SupportNotificationEmail, sanitizedData)
    );

    // Render user confirmation email
    const userHtml = await renderAsync(
      React.createElement(UserConfirmationEmail, {
        name: sanitizedData.name,
      })
    );

    // Send email to support team
    const supportEmail = await resend.emails.send({
      from: "heartlines Contact Form <sam@heartlines.ai>",
      to: ["support@heartlines.ai"],
      replyTo: sanitizedData.email,
      subject: `Contact Form: ${sanitizedData.subject}`,
      html: supportHtml,
    });

    console.log("Support email sent:", supportEmail);

    // Send confirmation to user
    const userEmail = await resend.emails.send({
      from: "Sam from Heartlines <sam@heartlines.ai>",
      to: [sanitizedData.email],
      subject: "We received your message",
      html: userHtml,
    });

    console.log("User confirmation sent:", userEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
