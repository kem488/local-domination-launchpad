import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAKE_WEBHOOK_URL = Deno.env.get("MAKE_WEBHOOK_URL") || "https://hook.eu2.make.com/webhook-placeholder";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventType, data } = await req.json();

    const webhookPayload = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      source: '5-star-digital',
      data: data
    };

    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!makeResponse.ok) {
      throw new Error(`Make.com webhook failed: ${makeResponse.status}`);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Data sent to Make.com successfully'
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