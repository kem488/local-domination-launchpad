import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  event_type: 'client_onboarding' | 'client_update' | 'status_change' | 'follow_up_sent';
  timestamp: string;
  client_id: string;
  business_data: {
    business_name: string;
    owner_name: string | null;
    owner_email: string;
    phone: string | null;
    address: string | null;
    postcode: string | null;
  };
  status_data: {
    onboarding_status: string;
    gbp_status: string | null;
    last_follow_up: string | null;
  };
  agency_data: {
    user_id: string;
    agency_email: string;
  };
}

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/fm9a9bzxfro522qej7zdu1zaa2tct481";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    
    console.log('Sending webhook to Make.com:', {
      event_type: payload.event_type,
      client_id: payload.client_id,
      business_name: payload.business_data.business_name
    });

    const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      throw new Error(`Make.com webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
    }

    console.log('Webhook sent successfully to Make.com');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook sent successfully'
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending webhook to Make.com:', error);
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