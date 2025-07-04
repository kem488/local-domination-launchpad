import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

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

// Email validation function
function isValidEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

// UK phone validation function  
function isValidUKPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^(\+44|0)[0-9]{10,11}$/.test(cleaned);
}

// UK postcode validation function
function isValidUKPostcode(postcode: string): boolean {
  return /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i.test(postcode.replace(/\s/g, ''));
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Please enter a valid email address' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Sanitize and validate optional fields
    const scanId = requestData.scanId ? requestData.scanId.trim() : null;
    const name = requestData.name ? requestData.name.trim().slice(0, 50) : null;
    const businessName = requestData.businessName ? requestData.businessName.trim().slice(0, 100) : null;
    const businessLocation = requestData.businessLocation ? requestData.businessLocation.trim().slice(0, 200) : null;
    const source = requestData.source ? requestData.source.trim().slice(0, 50) : 'unknown';
    
    // Validate phone if provided
    let phone = null;
    if (requestData.phone && typeof requestData.phone === 'string') {
      phone = requestData.phone.trim();
      if (phone && !isValidUKPhone(phone)) {
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
      if (postcode && !isValidUKPostcode(postcode)) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid UK postcode' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

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