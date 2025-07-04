import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-TRIAL-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Initialize Supabase with service role for auth check
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check onboarding record for trial/payment status, prioritizing trial-active records
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('client_onboarding')
      .select('payment_status, trial_active, trial_expires_at, stripe_customer_id')
      .eq('user_id', user.id)
      .order('trial_active', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (onboardingError) {
      logStep("No onboarding record found - user needs to complete payment", { error: onboardingError.message });
      return new Response(JSON.stringify({ 
        hasAccess: false, 
        reason: 'no_onboarding',
        message: 'Payment required to access onboarding'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const now = new Date();
    const trialExpired = onboardingData.trial_expires_at && new Date(onboardingData.trial_expires_at) < now;

    logStep("Checking access", { 
      paymentStatus: onboardingData.payment_status,
      trialActive: onboardingData.trial_active,
      trialExpired
    });

    // Grant access if:
    // 1. Has active trial that hasn't expired
    // 2. Has subscribed status
    const hasAccess = (
      (onboardingData.trial_active && !trialExpired) ||
      onboardingData.payment_status === 'subscribed'
    );

    let reason = '';
    let message = '';

    if (!hasAccess) {
      if (trialExpired) {
        reason = 'trial_expired';
        message = 'Your trial has expired. Please upgrade to continue.';
      } else if (onboardingData.payment_status === 'pending') {
        reason = 'payment_pending';
        message = 'Payment required to access onboarding.';
      } else {
        reason = 'no_access';
        message = 'Access denied. Please complete payment.';
      }
    }

    logStep("Access check result", { hasAccess, reason });

    return new Response(JSON.stringify({ 
      hasAccess,
      reason,
      message,
      paymentStatus: onboardingData.payment_status,
      trialActive: onboardingData.trial_active,
      trialExpiresAt: onboardingData.trial_expires_at
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-trial-status", { message: errorMessage });
    return new Response(JSON.stringify({ 
      hasAccess: false, 
      reason: 'error',
      message: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});