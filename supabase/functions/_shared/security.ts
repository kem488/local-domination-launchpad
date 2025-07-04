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
    // Get client IP from various headers
    const clientIP = 
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - options.windowMinutes);

    // Check current rate limit
    const { data: existing, error } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('ip_address', clientIP)
      .eq('endpoint', options.endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // Not found is OK
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Allow on error to not block legitimate users
    }

    const currentCount = existing?.request_count || 0;

    if (currentCount >= options.maxRequests) {
      // Log rate limit violation
      await supabase
        .from('security_logs')
        .insert({
          event_type: 'rate_limit_exceeded',
          ip_address: clientIP,
          user_agent: req.headers.get('user-agent'),
          metadata: {
            endpoint: options.endpoint,
            requests: currentCount,
            limit: options.maxRequests
          }
        });

      return { allowed: false, remaining: 0 };
    }

    // Update or insert rate limit record
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
      console.error('Rate limit upsert error:', upsertError);
    }

    return { 
      allowed: true, 
      remaining: options.maxRequests - (currentCount + 1) 
    };

  } catch (error) {
    console.error('Rate limiting error:', error);
    return { allowed: true }; // Allow on error
  }
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
    const clientIP = 
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    await supabase
      .from('security_logs')
      .insert({
        event_type: eventType,
        ip_address: clientIP,
        user_agent: req.headers.get('user-agent'),
        metadata
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}