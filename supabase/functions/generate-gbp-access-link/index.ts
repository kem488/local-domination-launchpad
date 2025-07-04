import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || '',
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ''
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { clientId } = await req.json();

    // Get client data
    const { data: clientData, error: clientError } = await supabase
      .from('client_onboarding')
      .select('business_name, owner_email')
      .eq('id', clientId)
      .eq('user_id', user.id)
      .single();

    if (clientError || !clientData) {
      throw new Error('Client not found or access denied');
    }

    // Generate Google Business Profile access URL
    const accessUrl = `https://business.google.com/manage`;

    // Create GBP access request
    const { data: accessRequest, error: accessError } = await supabase
      .from('gbp_access_requests')
      .upsert({
        client_id: clientId,
        request_url: accessUrl,
        status: 'sent',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'client_id'
      })
      .select()
      .single();

    if (accessError) {
      throw accessError;
    }

    // Send welcome email
    try {
      await supabase.functions.invoke('send-gbp-email', {
        body: {
          type: 'welcome',
          clientId: clientId,
          recipientEmail: clientData.owner_email,
          businessName: clientData.business_name,
          accessUrl: accessUrl
        }
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      accessUrl: accessUrl,
      requestId: accessRequest.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});