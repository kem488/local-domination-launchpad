import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!googleApiKey) {
      console.error('Google Places API key not found in environment');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Google Places API key not configured',
        details: 'API key environment variable is missing'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Testing Google Places API with a simple known business search...');
    
    // Test with a very well-known business
    const testQuery = "McDonald's London";
    const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(testQuery)}&key=${googleApiKey}`;
    
    console.log(`Making test request to: ${testUrl.replace(googleApiKey, '***HIDDEN***')}`);
    
    const startTime = Date.now();
    const response = await fetch(testUrl);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`Google API response status: ${response.status}`);
    console.log(`Response time: ${responseTime}ms`);
    
    const data = await response.json();
    console.log('Google API response data:', JSON.stringify(data, null, 2));
    
    // Analyze the response
    const analysis = {
      httpStatus: response.status,
      responseTime,
      googleStatus: data.status,
      resultsCount: data.results?.length || 0,
      hasError: !!data.error_message,
      errorMessage: data.error_message,
      timestamp: new Date().toISOString()
    };
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      console.log('✅ Google Places API test successful!');
      return new Response(JSON.stringify({
        success: true,
        message: 'Google Places API is working correctly',
        analysis,
        testQuery,
        sampleResult: {
          name: data.results[0].name,
          address: data.results[0].formatted_address,
          rating: data.results[0].rating,
          placeId: data.results[0].place_id
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ Google Places API test failed');
      return new Response(JSON.stringify({
        success: false,
        error: 'Google Places API test failed',
        analysis,
        testQuery,
        googleResponse: data
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error testing Google Places API:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to test Google Places API',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);