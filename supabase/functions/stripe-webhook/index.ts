import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  console.log(`[Stripe Webhook] ${step}`, details ? JSON.stringify(details, null, 2) : '');
};

// Live mode Price ID to tier mapping
const PRICE_TO_TIER: Record<string, string> = {
  "price_1SPptv0Qbw5K8bv3ZSnhora7": "glow",
  "price_1SPpwt0Qbw5K8bv3SylnAw9H": "vibe",
  "price_1SPpxr0Qbw5K8bv32sY31kqe": "unlimited"
};

// Tier to message limit mapping
const TIER_MESSAGE_LIMITS: Record<string, number> = {
  glow: 150,
  vibe: 300,
  unlimited: 0 // 0 = unlimited
};

// Helper function to safely convert timestamp to ISO string
const getSubscriptionEndDate = (timestamp: number | null | undefined): string | null => {
  if (!timestamp || isNaN(timestamp)) return null;
  try {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("Missing signature");
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16"
    });

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("Missing webhook secret");
      return new Response(JSON.stringify({ error: "Webhook secret not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify webhook signature
    const body = await req.text();
    let event: Stripe.Event;
    
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Signature verified", { type: event.type });
    } catch (err) {
      logStep("Signature verification failed", { error: err.message });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id, customerId: session.customer });

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = subscription.items.data[0]?.price.id;
          const tier = PRICE_TO_TIER[priceId] || null;
          const messageLimit = tier ? TIER_MESSAGE_LIMITS[tier] : 25;

          logStep("Processing subscription", { 
            subscriptionId: subscription.id, 
            priceId, 
            tier,
            messageLimit 
          });

          // Update subscribers table
          const { error: subError } = await supabase
            .from("subscribers")
            .upsert({
              email: session.customer_email || session.customer_details?.email,
              stripe_customer_id: session.customer as string,
              subscribed: true,
              subscription_tier: tier,
              subscription_end: getSubscriptionEndDate(subscription.current_period_end),
              updated_at: new Date().toISOString()
            }, {
              onConflict: "stripe_customer_id"
            });

          if (subError) {
            logStep("Error updating subscribers", { error: subError });
          } else {
            logStep("Subscriber updated successfully");
          }

          // Get user_id from email
          const { data: authUser } = await supabase.auth.admin.listUsers();
          const user = authUser?.users.find(u => u.email === session.customer_email || u.email === session.customer_details?.email);

          if (user) {
            // Update message usage table
            const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
            const { error: usageError } = await supabase
              .from("user_message_usage")
              .upsert({
                user_id: user.id,
                usage_month: currentMonth,
                subscription_tier: tier,
                current_month_usage: 0,
                updated_at: new Date().toISOString()
              }, {
                onConflict: "user_id,usage_month"
              });

            if (usageError) {
              logStep("Error updating usage", { error: usageError });
            } else {
              logStep("Usage updated successfully");
            }
          }
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const tier = PRICE_TO_TIER[priceId] || null;
        
        logStep("Subscription created", { subscriptionId: subscription.id, tier });

        // Fetch customer email from Stripe
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;

        const { error } = await supabase
          .from("subscribers")
          .upsert({
            email: customerEmail,
            stripe_customer_id: subscription.customer as string,
            subscribed: true,
            subscription_tier: tier,
            subscription_end: getSubscriptionEndDate(subscription.current_period_end),
            updated_at: new Date().toISOString()
          }, {
            onConflict: "stripe_customer_id"
          });

        if (error) {
          logStep("Error in subscription.created", { error });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const tier = PRICE_TO_TIER[priceId] || null;
        
        logStep("Subscription updated", { 
          subscriptionId: subscription.id, 
          tier,
          status: subscription.status 
        });

        // Fetch customer email from Stripe
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;

        // First try to update existing record
        const { error: updateError } = await supabase
          .from("subscribers")
          .update({
            email: customerEmail,
            subscribed: subscription.status === "active",
            subscription_tier: tier,
            subscription_end: getSubscriptionEndDate(subscription.current_period_end),
            updated_at: new Date().toISOString()
          })
          .eq("stripe_customer_id", subscription.customer as string);

        // If no rows updated, insert new record
        if (updateError?.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from("subscribers")
            .insert({
              email: customerEmail,
              stripe_customer_id: subscription.customer as string,
              subscribed: subscription.status === "active",
              subscription_tier: tier,
              subscription_end: getSubscriptionEndDate(subscription.current_period_end),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            logStep("Error in subscription.updated (insert)", { error: insertError });
          }
        } else if (updateError) {
          logStep("Error in subscription.updated", { error: updateError });
        }

        // Update tier in user_message_usage WITHOUT resetting usage (graceful grandfathering)
        // Get user_id from email
        const { data: authUser } = await supabase.auth.admin.listUsers();
        const user = authUser?.users.find(u => u.email === customerEmail);

        if (user) {
          const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
          
          // Only update the tier, keep current_month_usage unchanged
          const { error: usageError } = await supabase
            .from("user_message_usage")
            .update({
              subscription_tier: tier,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", user.id)
            .eq("usage_month", currentMonth);

          if (usageError) {
            logStep("Error updating usage tier", { error: usageError });
          } else {
            logStep("Usage tier updated (usage preserved for graceful grandfathering)");
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        logStep("Subscription deleted", { subscriptionId: subscription.id });

        // Revert to freemium
        const { error } = await supabase
          .from("subscribers")
          .update({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_customer_id", subscription.customer as string);

        if (error) {
          logStep("Error in subscription.deleted", { error });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        
        logStep("Payment succeeded", { invoiceId: invoice.id, customerId: invoice.customer });

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const priceId = subscription.items.data[0]?.price.id;
          const tier = PRICE_TO_TIER[priceId] || null;

          // Extend subscription end date
          const { error } = await supabase
            .from("subscribers")
            .update({
              subscribed: true,
              subscription_tier: tier,
              subscription_end: getSubscriptionEndDate(subscription.current_period_end),
              updated_at: new Date().toISOString()
            })
            .eq("stripe_customer_id", invoice.customer as string);

          if (error) {
            logStep("Error in payment_succeeded", { error });
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        
        logStep("Payment failed", { 
          invoiceId: invoice.id, 
          customerId: invoice.customer,
          attemptCount: invoice.attempt_count 
        });

        // Log failure but don't immediately revoke access
        // Stripe typically retries failed payments
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    logStep("Error processing webhook", { error: error.message, stack: error.stack });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
