import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestApiRequest {
  query?: string;
}

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

    // Get custom query from request body or use default
    let testQuery = "McDonald's London";
    if (req.method === 'POST') {
      try {
        const body: TestApiRequest = await req.json();
        if (body.query) {
          testQuery = body.query;
        }
      } catch {
        // Use default query if body parsing fails
      }
    }

    console.log(`Testing Google Places API with query: "${testQuery}"`);
    
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
      timestamp: new Date().toISOString(),
      quotaRemaining: response.headers.get('X-RateLimit-Remaining'),
      dailyQuota: response.headers.get('X-RateLimit-Limit')
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
          placeId: data.results[0].place_id,
          types: data.results[0].types
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error('❌ Google Places API test failed');
      
      // Provide more specific error messages
      let errorMessage = 'Google Places API test failed';
      if (data.status === 'OVER_QUERY_LIMIT') {
        errorMessage = 'Google Places API quota exceeded';
      } else if (data.status === 'REQUEST_DENIED') {
        errorMessage = 'Google Places API request denied - check API key and permissions';
      } else if (data.status === 'INVALID_REQUEST') {
        errorMessage = 'Invalid request parameters';
      }
      
      return new Response(JSON.stringify({
        success: false,
        error: errorMessage,
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