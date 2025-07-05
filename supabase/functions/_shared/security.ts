import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

interface RateLimitOptions {
  maxRequests: number;
  windowMinutes: number;
  endpoint: string;
}

export async function checkRateLimit(
  req: Request,
  supabase: any,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining?: number }> {
  try {
    // Get client IP from various headers with better security
    const clientIP = getClientIP(req);
    
    // Enhanced validation - reject obvious attack patterns
    if (clientIP === 'unknown' || clientIP.length > 45) {
      await logSecurityEvent(supabase, 'suspicious_ip', req, { ip: clientIP });
      return { allowed: false, remaining: 0 };
    }

    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - options.windowMinutes);

    // Check current rate limit with stronger validation
    const { data: existing, error } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('ip_address', clientIP)
      .eq('endpoint', options.endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is OK
      await logSecurityEvent(supabase, 'rate_limit_error', req, { error: error.message });
      return { allowed: true }; // Allow on error to not block legitimate users
    }

    const currentCount = existing?.request_count || 0;

    // Enhanced blocking with security logging
    if (currentCount >= options.maxRequests) {
      await Promise.all([
        supabase.from('security_logs').insert({
          event_type: 'rate_limit_exceeded',
          ip_address: clientIP,
          user_agent: req.headers.get('user-agent'),
          metadata: {
            endpoint: options.endpoint,
            requests: currentCount,
            limit: options.maxRequests,
            severity: currentCount > options.maxRequests * 2 ? 'HIGH' : 'MEDIUM'
          }
        }),
        // Log to audit table if available
        supabase.from('security_audit_logs').insert({
          action: 'rate_limit_exceeded',
          resource_type: 'endpoint',
          resource_id: options.endpoint,
          ip_address: clientIP,
          user_agent: req.headers.get('user-agent'),
          success: false,
          details: { requests: currentCount, limit: options.maxRequests }
        })
      ]);

      return { allowed: false, remaining: 0 };
    }

    // Update rate limit with enhanced error handling
    const { error: upsertError } = await supabase
      .from('rate_limits')
      .upsert({
        ip_address: clientIP,
        endpoint: options.endpoint,
        request_count: currentCount + 1,
        window_start: new Date().toISOString()
      }, {
        onConflict: 'ip_address,endpoint,window_start'
      });

    if (upsertError) {
      await logSecurityEvent(supabase, 'rate_limit_upsert_error', req, { 
        error: upsertError.message 
      });
    }

    return { 
      allowed: true, 
      remaining: options.maxRequests - (currentCount + 1) 
    };

  } catch (error) {
    await logSecurityEvent(supabase, 'rate_limit_system_error', req, { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return { allowed: true }; // Allow on error but log it
  }
}

// Enhanced IP detection with security validation
function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfIP = req.headers.get('cf-connecting-ip');
  
  // Get the first IP from x-forwarded-for (most reliable)
  if (forwarded) {
    const firstIP = forwarded.split(',')[0]?.trim();
    if (firstIP && isValidIP(firstIP)) {
      return firstIP;
    }
  }
  
  // Fallback to other headers
  if (realIP && isValidIP(realIP)) return realIP;
  if (cfIP && isValidIP(cfIP)) return cfIP;
  
  return 'unknown';
}

// Basic IP validation
function isValidIP(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6 regex (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

export function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export function validateUKPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^(\+44|0)[0-9]{10,11}$/.test(cleaned);
}

export function validateUKPostcode(postcode: string): boolean {
  return /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(postcode.replace(/\s/g, ''));
}

export function sanitizeString(input: string, maxLength: number = 255): string {
  return input.trim().slice(0, maxLength);
}

export async function logSecurityEvent(
  supabase: any,
  eventType: string,
  req: Request,
  metadata?: any
): Promise<void> {
  try {
    const clientIP = getClientIP(req);

    // Enhanced security event logging with validation
    const logData = {
      event_type: eventType,
      ip_address: clientIP,
      user_agent: req.headers.get('user-agent')?.slice(0, 500), // Prevent excessive data
      metadata: {
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method,
        ...metadata
      }
    };

    await Promise.all([
      // Log to security_logs
      supabase.from('security_logs').insert(logData),
      
      // Also log to audit table for critical events
      ['rate_limit_exceeded', 'suspicious_ip', 'invalid_input'].includes(eventType) 
        ? supabase.from('security_audit_logs').insert({
            action: eventType,
            resource_type: 'security_event',
            ip_address: clientIP,
            user_agent: req.headers.get('user-agent'),
            success: false,
            details: metadata
          })
        : Promise.resolve()
    ]);
  } catch (error) {
    // Fallback logging - don't let logging failures break the app
    console.error('Failed to log security event:', { eventType, error: error instanceof Error ? error.message : String(error) });
  }
}