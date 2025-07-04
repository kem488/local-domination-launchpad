import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  clientId: string;
  businessName: string;
  ownerEmail: string;
  agencyEmail: string;
}

// Hardcoded agency configuration
const AGENCY_CONFIG = {
  organizationId: "256083320097",
  agencyEmail: "integrations@syngularitylabs.com",
  companyName: "Syngularity Labs",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { clientId, businessName, ownerEmail }: RequestBody = await req.json();

    console.log('Generating GBP access link for:', { clientId, businessName, ownerEmail, agencyEmail: AGENCY_CONFIG.agencyEmail });

    // Create the Google Business Profile access request URL
    const accessUrl = "https://business.google.com";

    // Store the GBP access request in the database
    const { data: gbpRequest, error: gbpError } = await supabase
      .from('gbp_access_requests')
      .insert({
        client_id: clientId,
        status: 'sent',
        request_url: accessUrl,
      })
      .select()
      .single();

    if (gbpError) {
      console.error('Error creating GBP access request:', gbpError);
      throw gbpError;
    }

    console.log('GBP access request created:', gbpRequest);

    return new Response(
      JSON.stringify({
        success: true,
        accessUrl: accessUrl,
        requestId: gbpRequest.id
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in generate-gbp-access-link function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});