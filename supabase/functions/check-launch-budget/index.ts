import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LaunchLimits {
  max_daily_ai_spend: number;
  max_concurrent_users: number;
  waitlist_active: boolean;
  auto_throttle_enabled: boolean;
  spend_check_window_hours: number;
}

interface SpendData {
  total_cost: number;
  request_count: number;
  unique_users: number;
}

interface HourlySpend {
  hour: string;
  hourly_cost: number;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("[check-launch-budget] Starting budget check...");

    // Get launch limits configuration
    const { data: limits, error: limitsError } = await supabase
      .from("launch_limits")
      .select("*")
      .single();

    if (limitsError) {
      console.error("[check-launch-budget] Error fetching limits:", limitsError);
      throw new Error("Failed to fetch launch limits");
    }

    const config = limits as LaunchLimits;
    console.log("[check-launch-budget] Config:", config);

    // Get today's spend
    const { data: dailySpend, error: spendError } = await supabase
      .from("daily_ai_spend_summary")
      .select("*")
      .single();

    const todaySpend = (dailySpend as SpendData)?.total_cost || 0;
    console.log("[check-launch-budget] Today's spend: $", todaySpend);

    // Get hourly spend for velocity calculation
    const { data: hourlyData, error: hourlyError } = await supabase
      .from("hourly_ai_spend")
      .select("*")
      .limit(config.spend_check_window_hours);

    // Calculate spend velocity
    let recentHourlySpend = 0;
    if (hourlyData && hourlyData.length > 0) {
      recentHourlySpend = (hourlyData as HourlySpend[]).reduce(
        (sum, h) => sum + (h.hourly_cost || 0), 0
      ) / hourlyData.length;
    }
    const projectedDailySpend = recentHourlySpend * 24;

    console.log("[check-launch-budget] Spend velocity: $", recentHourlySpend, "/hour");
    console.log("[check-launch-budget] Projected daily: $", projectedDailySpend);

    // Count current users
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    console.log("[check-launch-budget] Current users:", userCount);

    // Determine if we should activate waitlist
    let shouldActivateWaitlist = false;
    let reason = "";

    if (config.auto_throttle_enabled) {
      if (todaySpend >= config.max_daily_ai_spend) {
        shouldActivateWaitlist = true;
        reason = `Daily AI spend ($${todaySpend.toFixed(2)}) exceeded limit ($${config.max_daily_ai_spend})`;
      } else if (projectedDailySpend > config.max_daily_ai_spend * 1.5) {
        // If projected to exceed by 50%, preemptively activate
        shouldActivateWaitlist = true;
        reason = `Projected daily spend ($${projectedDailySpend.toFixed(2)}) exceeds 150% of limit`;
      }
    }

    if ((userCount || 0) >= config.max_concurrent_users) {
      shouldActivateWaitlist = true;
      reason = `User count (${userCount}) reached max (${config.max_concurrent_users})`;
    }

    // Update waitlist status if needed
    if (shouldActivateWaitlist && !config.waitlist_active) {
      console.log("[check-launch-budget] Activating waitlist:", reason);
      
      const { error: updateError } = await supabase
        .from("launch_limits")
        .update({ 
          waitlist_active: true, 
          updated_at: new Date().toISOString() 
        })
        .eq("id", limits.id);

      if (updateError) {
        console.error("[check-launch-budget] Failed to activate waitlist:", updateError);
      }

      // Send alert email
      try {
        await supabase.functions.invoke("api-error-alert", {
          body: {
            alert_type: "budget_throttle",
            message: `Waitlist auto-activated: ${reason}`,
            details: {
              todaySpend,
              projectedDailySpend,
              userCount,
              maxSpend: config.max_daily_ai_spend,
              maxUsers: config.max_concurrent_users
            }
          }
        });
      } catch (alertError) {
        console.error("[check-launch-budget] Failed to send alert:", alertError);
      }
    }

    const result = {
      waitlist_active: config.waitlist_active || shouldActivateWaitlist,
      today_spend: todaySpend,
      max_daily_spend: config.max_daily_ai_spend,
      spend_percentage: (todaySpend / config.max_daily_ai_spend) * 100,
      projected_daily_spend: projectedDailySpend,
      current_users: userCount,
      max_users: config.max_concurrent_users,
      user_percentage: ((userCount || 0) / config.max_concurrent_users) * 100,
      should_activate: shouldActivateWaitlist,
      activation_reason: reason || null
    };

    console.log("[check-launch-budget] Result:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("[check-launch-budget] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
