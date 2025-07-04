import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TRIAL-RATE-LOCK-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }
    logStep("Environment variables verified");

    const { name, email, phone, businessType } = await req.json();
    if (!name || !email || !phone || !businessType) {
      throw new Error("Missing required fields: name, email, phone, businessType");
    }
    logStep("Request data validated", { name, email, businessType });

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Generate a temporary password for the user
    const tempPassword = crypto.randomUUID();
    
    // Create user account in Supabase
    let userId;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        name,
        business_type: businessType
      }
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered') || authError.message.includes('already been taken')) {
        logStep("User already exists, fetching existing user", { email });
        const { data: existingUser, error: fetchError } = await supabase.auth.admin.listUsers();
        if (!fetchError && existingUser?.users) {
          const existingUserData = existingUser.users.find(u => u.email === email);
          if (existingUserData) {
            userId = existingUserData.id;
            logStep("Found existing user", { userId });
          } else {
            throw new Error("Could not find existing user");
          }
        } else {
          throw new Error(`Authentication error: ${authError.message}`);
        }
      } else {
        throw new Error(`Failed to create user: ${authError.message}`);
      }
    } else {
      userId = authData.user.id;
      logStep("New user created", { userId });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email,
        name,
        phone,
        metadata: {
          business_type: businessType,
          supabase_user_id: userId
        }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Create or update client_onboarding record
    const { error: onboardingError } = await supabase
      .from('client_onboarding')
      .upsert({
        user_id: userId,
        business_name: name,
        owner_email: email,
        phone,
        industry: businessType,
        onboarding_step: 1,
        status: 'trial_started'
      }, { 
        onConflict: 'user_id'
      });

    if (onboardingError) {
      logStep("Warning: Could not create onboarding record", { error: onboardingError.message });
    } else {
      logStep("Client onboarding record created/updated");
    }

    // Create checkout session with 14-day trial + locked rate
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Local Market Domination System - Locked Rate",
              description: "AI-powered review automation system for UK tradespeople. 25+ reviews, 4.5+ stars, 2x Google visibility in 90 days - guaranteed."
            },
            unit_amount: 9700, // £97 in pence
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          locked_rate: "true",
          rate_lock_deadline: "2025-07-31",
          business_type: businessType
        }
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}&temp_password=${encodeURIComponent(tempPassword)}`,
      cancel_url: `${origin}/?cancelled=true`,
      allow_promotion_codes: false,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      url: session.url,
      user_created: true,
      user_id: userId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in trial-rate-lock-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});