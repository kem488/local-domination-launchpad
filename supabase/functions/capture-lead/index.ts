import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadCaptureRequest {
  scanId: string;
  email: string;
  phone?: string;
  postcode?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scanId, email, phone, postcode, source }: LeadCaptureRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update scan with lead information
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