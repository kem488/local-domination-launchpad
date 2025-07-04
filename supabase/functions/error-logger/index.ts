import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { checkRateLimit, logSecurityEvent } from "../_shared/security.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ErrorLogRequest {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  source: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface PerformanceLogRequest {
  metric: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  source: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Rate limiting - 100 requests per minute per IP
    const rateLimitResult = await checkRateLimit(req, supabase, {
      maxRequests: 100,
      windowMinutes: 1,
      endpoint: 'error-logger'
    });

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { type, ...data } = await req.json();

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     req.headers.get('x-real-ip') ||
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';

    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (type === 'error') {
      const errorLog: ErrorLogRequest = data;
      
      // Log to security_logs table
      await supabase
        .from('security_logs')
        .insert({
          event_type: 'client_error',
          ip_address: clientIP,
          user_agent: userAgent,
          user_id: errorLog.userId || null,
          metadata: {
            level: errorLog.level,
            message: errorLog.message,
            source: errorLog.source,
            stack: errorLog.stack,
            url: errorLog.url,
            custom_metadata: errorLog.metadata
          }
        });

      // For critical errors, create an alert
      if (errorLog.level === 'error') {
        console.error(`CRITICAL ERROR: ${errorLog.message}`, {
          source: errorLog.source,
          stack: errorLog.stack,
          userId: errorLog.userId,
          userAgent,
          clientIP
        });
      }

    } else if (type === 'performance') {
      const perfLog: PerformanceLogRequest = data;
      
      // Log performance metrics
      await supabase
        .from('security_logs')
        .insert({
          event_type: 'performance_metric',
          ip_address: clientIP,
          user_agent: userAgent,
          metadata: {
            metric: perfLog.metric,
            value: perfLog.value,
            unit: perfLog.unit,
            source: perfLog.source,
            custom_metadata: perfLog.metadata
          }
        });

      // Alert on performance thresholds
      if (perfLog.metric === 'page_load_time' && perfLog.value > 3000) {
        console.warn(`SLOW PAGE LOAD: ${perfLog.value}ms`, {
          source: perfLog.source,
          userAgent,
          clientIP
        });
      }

    } else if (type === 'security') {
      // Log security events
      await logSecurityEvent(supabase, data.eventType, req, data.metadata);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in error-logger function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});