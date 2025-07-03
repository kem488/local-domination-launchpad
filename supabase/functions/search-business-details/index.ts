import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
}

interface BusinessDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };
  types: string[];
  photos?: any[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query }: SearchRequest = await req.json();
    
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;
    
    if (!googleApiKey) {
      throw new Error('Google Places API key not configured');
    }

    console.log(`Searching for businesses: "${query}"`);

    // Search for businesses
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${googleApiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.status !== 'OK') {
      console.error(`Google Places API error: ${searchData.status}`);
      throw new Error(`Search failed: ${searchData.status}`);
    }

    if (!searchData.results || searchData.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get detailed information for top 5 results
    const businesses = await Promise.all(
      searchData.results.slice(0, 5).map(async (place: any) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,types,photos&key=${googleApiKey}`;
          
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (detailsData.status === 'OK') {
            const details: BusinessDetails = detailsData.result;
            
            // Map Google business types to our industry categories
            const industry = mapGoogleTypesToIndustry(details.types);
            
            // Format business hours for our system
            const businessHours = formatBusinessHours(details.opening_hours);
            
            return {
              place_id: details.place_id,
              name: details.name,
              address: details.formatted_address,
              phone: details.formatted_phone_number,
              website: details.website,
              rating: details.rating,
              review_count: details.user_ratings_total,
              industry,
              business_hours: businessHours,
              types: details.types,
              has_photos: !!(details.photos && details.photos.length > 0),
              confidence_score: calculateConfidenceScore(details, query)
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching details for place ${place.place_id}:`, error);
          return null;
        }
      })
    );

    // Filter out failed requests and sort by confidence
    const validBusinesses = businesses
      .filter(business => business !== null)
      .sort((a, b) => b.confidence_score - a.confidence_score);

    console.log(`Found ${validBusinesses.length} valid businesses`);

    return new Response(JSON.stringify({
      success: true,
      results: validBusinesses
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in search-business-details function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to search businesses'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function mapGoogleTypesToIndustry(types: string[]): string {
  const typeMapping: { [key: string]: string } = {
    'plumber': 'plumbing',
    'electrician': 'electrical',
    'heating_contractor': 'heating',
    'hvac_contractor': 'heating',
    'landscaping': 'landscaping',
    'roofing_contractor': 'roofing',
    'painter': 'painting',
    'general_contractor': 'construction',
    'car_repair': 'automotive',
    'auto_repair': 'automotive',
    'cleaning_service': 'cleaning'
  };

  for (const type of types) {
    if (typeMapping[type]) {
      return typeMapping[type];
    }
  }

  // Default mappings for common business types
  if (types.includes('establishment')) return 'other';
  return 'other';
}

function formatBusinessHours(openingHours?: any): any {
  if (!openingHours || !openingHours.periods) {
    return {};
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const hours: any = {};

  // Initialize all days as closed
  dayNames.forEach(day => {
    hours[day] = { closed: true, open: '09:00', close: '17:00' };
  });

  // Process Google's opening hours format
  openingHours.periods?.forEach((period: any) => {
    if (period.open && period.open.day !== undefined) {
      const dayName = dayNames[period.open.day];
      const openTime = formatTime(period.open.time);
      const closeTime = period.close ? formatTime(period.close.time) : '23:59';
      
      hours[dayName] = {
        closed: false,
        open: openTime,
        close: closeTime
      };
    }
  });

  return hours;
}

function formatTime(time: string): string {
  if (time.length === 4) {
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }
  return time;
}

function calculateConfidenceScore(business: BusinessDetails, query: string): number {
  let score = 0;
  
  // Name similarity (40 points)
  const nameSimilarity = calculateStringSimilarity(business.name.toLowerCase(), query.toLowerCase());
  score += nameSimilarity * 40;
  
  // Has essential business info (30 points)
  if (business.formatted_phone_number) score += 10;
  if (business.website) score += 10;
  if (business.opening_hours) score += 10;
  
  // Review quality (20 points)
  if (business.rating && business.user_ratings_total) {
    const reviewScore = (business.rating / 5) * (Math.min(business.user_ratings_total / 10, 1));
    score += reviewScore * 20;
  }
  
  // Has photos (10 points)
  if (business.photos && business.photos.length > 0) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function calculateStringSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(' ');
  const words2 = str2.split(' ');
  
  let matches = 0;
  words1.forEach(word1 => {
    if (words2.some(word2 => word1.includes(word2) || word2.includes(word1))) {
      matches++;
    }
  });
  
  return words1.length > 0 ? matches / words1.length : 0;
}

serve(handler);