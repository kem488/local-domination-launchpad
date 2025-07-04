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

    const { 
      errorType, 
      errorMessage, 
      stackTrace, 
      userAgent, 
      url, 
      userId,
      metadata 
    } = await req.json();

    // Get client IP
    const clientIP = req.headers.get("x-forwarded-for") || 
                    req.headers.get("x-real-ip") || 
                    "unknown";

    // Log to Supabase security_logs table
    const { error: logError } = await supabase
      .from('security_logs')
      .insert({
        event_type: errorType || 'client_error',
        user_id: userId || null,
        ip_address: clientIP,
        user_agent: userAgent || null,
        metadata: {
          error_message: errorMessage,
          stack_trace: stackTrace,
          url: url,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });

    if (logError) {
      console.error('Failed to log error to database:', logError);
    }

    // Also log to console for immediate visibility
    console.error('CLIENT ERROR:', {
      type: errorType,
      message: errorMessage,
      url: url,
      userId: userId,
      userAgent: userAgent,
      ip: clientIP,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      success: true,
      logged: true 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in error-logger function:', errorMessage);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});