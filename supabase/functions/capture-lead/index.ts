import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { checkRateLimit, validateEmail, validateUKPhone, validateUKPostcode, sanitizeString, logSecurityEvent } from "../_shared/security.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadCaptureRequest {
  scanId?: string;
  email: string;
  name?: string;
  businessName?: string;
  businessLocation?: string;
  phone?: string;
  postcode?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Enhanced rate limiting for sensitive lead capture
    const rateLimitResult = await checkRateLimit(req, supabase, {
      maxRequests: 3, // Stricter limit for lead capture
      windowMinutes: 60,
      endpoint: 'capture-lead'
    });

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Too many requests. Please try again later.' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData = await req.json();
    
    // Input validation for email (required)
    if (!requestData.email || typeof requestData.email !== 'string') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email is required and must be a string' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const email = requestData.email.trim().toLowerCase();
    if (!validateEmail(email)) {
      await logSecurityEvent(supabase, 'invalid_email', req, { email });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please enter a valid email address' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Sanitize and validate optional fields
    const scanId = requestData.scanId ? sanitizeString(requestData.scanId, 50) : null;
    const name = requestData.name ? sanitizeString(requestData.name, 50) : null;
    const businessName = requestData.businessName ? sanitizeString(requestData.businessName, 100) : null;
    const businessLocation = requestData.businessLocation ? sanitizeString(requestData.businessLocation, 200) : null;
    const source = requestData.source ? sanitizeString(requestData.source, 50) : 'unknown';
    
    // Validate phone if provided
    let phone = null;
    if (requestData.phone && typeof requestData.phone === 'string') {
      phone = requestData.phone.trim();
      if (phone && !validateUKPhone(phone)) {
        await logSecurityEvent(supabase, 'invalid_phone', req, { phone });
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid UK phone number' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Validate postcode if provided
    let postcode = null;
    if (requestData.postcode && typeof requestData.postcode === 'string') {
      postcode = requestData.postcode.trim().toUpperCase();
      if (postcode && !validateUKPostcode(postcode)) {
        await logSecurityEvent(supabase, 'invalid_postcode', req, { postcode });
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid UK postcode' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (scanId) {
      // Update existing scan with lead information
      const { data: updatedScan, error: updateError } = await supabase
        .from('business_scans')
        .update({ 
          email,
          phone,
          postcode
        })
        .eq('id', scanId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Create detailed report entry
      const { error: reportError } = await supabase
        .from('scan_reports')
        .insert({
          scan_id: scanId,
          report_type: 'detailed_analysis',
          report_data: {
            leadCaptured: true,
            captureTime: new Date().toISOString(),
            contactInfo: { email, phone, postcode },
            source: source || 'unknown'
          }
        });

      if (reportError) {
        console.error('Error creating report:', reportError);
      }

      console.log(`Lead captured for scan ${scanId}: ${email}`);

      return new Response(JSON.stringify({
        success: true,
        message: 'Lead captured successfully',
        scanData: updatedScan
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Create new scan record for initial lead capture
      const { data: newScan, error: createError } = await supabase
        .from('business_scans')
        .insert({
          business_name: businessName || '',
          business_location: businessLocation || '',
          email,
          phone,
          postcode,
          scan_status: 'pending',
          lead_qualified: true
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      console.log(`Initial lead captured: ${email} for ${businessName}`);

      return new Response(JSON.stringify({
        success: true,
        message: 'Lead captured successfully',
        scanId: newScan.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error in capture-lead function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to capture lead' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);