import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use service role key to bypass RLS for updates
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body to check if we should skip Stripe validation
    const body = await req.text();
    const params = body ? JSON.parse(body) : {};
    const skipStripe = params.skipStripe === true;

    // If skipStripe is true, return cached data from Supabase
    if (skipStripe) {
      logStep("Skipping Stripe validation, returning cached data");
      
      const { data: subData } = await supabaseClient
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: usageData } = await supabaseClient
        .from('user_message_usage')
        .select('current_month_usage, subscription_tier')
        .eq('user_id', user.id)
        .single();

      const tier = subData?.subscription_tier || usageData?.subscription_tier || 'begin';
      const messageLimit = tier === 'grow' ? 100 : tier === 'thrive' ? 300 : 25;
      const messagesUsed = usageData?.current_month_usage || 0;

      return new Response(JSON.stringify({
        subscribed: subData?.subscribed || false,
        subscription_tier: tier,
        subscription_end: subData?.subscription_end || null,
        message_limit: messageLimit,
        messages_used: messagesUsed
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Continue with Stripe validation for full check
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2023-10-16" 
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Update subscribers table
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });

      // Initialize message usage for freemium tier
      await supabaseClient.from("user_message_usage").upsert({
        user_id: user.id,
        current_month_usage: 0,
        subscription_tier: "begin",
        usage_month: new Date().toISOString().slice(0, 7) + "-01", // First of current month
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,usage_month' });

      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: "begin",
        message_limit: 25,
        messages_used: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = "begin";
    let subscriptionEnd = null;
    let messageLimit = 25;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Determine tier from price amount
      const price = subscription.items.data[0].price;
      const amount = price.unit_amount || 0;
      
      if (amount === 1500) {
        subscriptionTier = "grow";
        messageLimit = 100;
      } else if (amount === 2900) {
        subscriptionTier = "thrive";
        messageLimit = 300;
      }
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd,
        tier: subscriptionTier,
        amount 
      });
    } else {
      logStep("No active subscription found");
    }

    // Update subscribers table
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    // Get current month usage
    const currentMonth = new Date().toISOString().slice(0, 7) + "-01";
    const { data: usageData } = await supabaseClient
      .from("user_message_usage")
      .select("current_month_usage")
      .eq("user_id", user.id)
      .eq("usage_month", currentMonth)
      .maybeSingle();

    const currentUsage = usageData?.current_month_usage || 0;

    // Initialize or update message usage
    await supabaseClient.from("user_message_usage").upsert({
      user_id: user.id,
      current_month_usage: currentUsage,
      subscription_tier: subscriptionTier,
      usage_month: currentMonth,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,usage_month' });

    logStep("Updated database with subscription info", { 
      subscribed: hasActiveSub, 
      subscriptionTier,
      messageLimit,
      currentUsage 
    });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      message_limit: messageLimit,
      messages_used: currentUsage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});