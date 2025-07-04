import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScanRequest {
  businessName: string;
  businessLocation: string;
}

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  photos?: any[];
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: any;
  types: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessName, businessLocation }: ScanRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!;
    
    if (!googleApiKey) {
      console.error('Google Places API key not configured');
      throw new Error('API configuration error');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting scan for: "${businessName}" in "${businessLocation}"`);

    // Get location coordinates for better search accuracy
    let locationCoordinates = null;
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(businessLocation)}&key=${googleApiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
        locationCoordinates = geocodeData.results[0].geometry.location;
        console.log(`Location coordinates found:`, locationCoordinates);
      }
    } catch (error) {
      console.warn(`Could not geocode location: ${businessLocation}`, error);
    }

    // Try multiple search strategies with location biasing
    const searchQueries = [
      `${businessName} ${businessLocation}`,
      `${businessName} near ${businessLocation}`,
      `${businessName}, ${businessLocation}`
    ];

    let searchData = null;
    let searchQuery = '';
    
    for (const query of searchQueries) {
      searchQuery = query;
      console.log(`Trying search query: "${searchQuery}"`);
      
      // Add location bias if coordinates available
      let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${googleApiKey}`;
      
      if (locationCoordinates) {
        const radius = 50000; // 50km radius
        searchUrl += `&location=${locationCoordinates.lat},${locationCoordinates.lng}&radius=${radius}`;
      }
      
      try {
        const searchResponse = await fetch(searchUrl);
        searchData = await searchResponse.json();
        
        console.log(`Google API response status: ${searchResponse.status}`);
        console.log(`Google API response:`, JSON.stringify(searchData, null, 2));
        
        if (searchData.status && searchData.status !== 'OK') {
          console.error(`Google Places API error: ${searchData.status} - ${searchData.error_message || 'Unknown error'}`);
          if (searchData.status === 'REQUEST_DENIED') {
            throw new Error('Google Places API access denied - check API key and permissions');
          }
          continue; // Try next query
        }
        
        if (searchData.results && searchData.results.length > 0) {
          // Filter results by location proximity if coordinates available
          if (locationCoordinates) {
            const filteredResults = searchData.results.filter(result => {
              if (result.geometry?.location) {
                const distance = calculateDistance(
                  locationCoordinates.lat, locationCoordinates.lng,
                  result.geometry.location.lat, result.geometry.location.lng
                );
                console.log(`Business "${result.name}" distance: ${distance}km`);
                return distance <= 50; // 50km radius
              }
              return true; // Keep if no coordinates to compare
            });
            
            if (filteredResults.length > 0) {
              searchData.results = filteredResults;
              console.log(`Found ${filteredResults.length} results within location radius for query: "${searchQuery}"`);
              break;
            }
          } else {
            console.log(`Found ${searchData.results.length} results for query: "${searchQuery}"`);
            break; // Success, exit loop
          }
        }
        
        console.log(`No results for query: "${searchQuery}"`);
      } catch (fetchError) {
        console.error(`Error fetching from Google Places API:`, fetchError);
        continue; // Try next query
      }
    }

    if (!searchData || !searchData.results || searchData.results.length === 0) {
      console.error('No business found after trying all search strategies');
      throw new Error(`Sorry, we couldn't find "${businessName}" in "${businessLocation}". Try using a more specific business name and location (e.g., "Joe's Plumbing, Manchester" or include a postcode).`);
    }

    // Select the best matching result (first one after filtering)
    const place = searchData.results[0];
    console.log(`Selected business: "${place.name}" at "${place.formatted_address}"`);
    
    // Verify business name similarity to prevent wrong matches
    const nameSimilarity = calculateNameSimilarity(businessName.toLowerCase(), place.name.toLowerCase());
    console.log(`Name similarity score: ${nameSimilarity}`);
    
    if (nameSimilarity < 0.3) {
      console.warn(`Low name similarity detected. Expected: "${businessName}", Found: "${place.name}"`);
    }
    
    // Get detailed place information
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=place_id,name,rating,user_ratings_total,photos,formatted_address,formatted_phone_number,website,opening_hours,types&key=${googleApiKey}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    const placeDetails: GooglePlaceDetails = detailsData.result;

    // Calculate scores based on the business data
    const scores = calculateBusinessScores(placeDetails);
    
    // Create scan record in database
    const { data: scanData, error: scanError } = await supabase
      .from('business_scans')
      .insert({
        business_name: businessName,
        business_location: businessLocation,
        google_place_id: placeDetails.place_id,
        overall_score: scores.overall,
        reviews_score: scores.reviews,
        engagement_score: scores.engagement,
        photos_score: scores.photos,
        completeness_score: scores.completeness,
        scan_status: 'completed',
        scan_results: {
          placeDetails,
          scores,
          analysis: generateAnalysis(scores, placeDetails)
        }
      })
      .select()
      .single();

    if (scanError) {
      throw scanError;
    }

    console.log(`Scan completed for ${businessName} with overall score: ${scores.overall}`);

    // Generate AI recommendations
    console.log(`Generating AI recommendations for scan ${scanData.id}`);
    try {
      const recommendationsResponse = await fetch(`${supabaseUrl}/functions/v1/generate-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scanId: scanData.id
        })
      });

      if (recommendationsResponse.ok) {
        console.log(`AI recommendations generated successfully for scan ${scanData.id}`);
      } else {
        console.error(`Failed to generate AI recommendations: ${recommendationsResponse.status}`);
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      // Continue without recommendations - non-blocking
    }

    return new Response(JSON.stringify({
      success: true,
      scanId: scanData.id,
      scores,
      placeDetails: {
        name: placeDetails.name,
        rating: placeDetails.rating,
        reviewCount: placeDetails.user_ratings_total,
        address: placeDetails.formatted_address,
        hasPhotos: placeDetails.photos && placeDetails.photos.length > 0,
        hasWebsite: !!placeDetails.website,
        hasPhone: !!placeDetails.formatted_phone_number,
        hasHours: !!placeDetails.opening_hours
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in scan-business function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to scan business' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function calculateBusinessScores(place: GooglePlaceDetails) {
  // Reviews & Rating Score (30% weight)
  let reviewsScore = 0;
  if (place.rating && place.user_ratings_total) {
    const ratingScore = (place.rating / 5) * 100;
    const volumeScore = Math.min((place.user_ratings_total / 50) * 100, 100);
    reviewsScore = Math.round((ratingScore * 0.7) + (volumeScore * 0.3));
  }

  // Customer Engagement Score (25% weight)
  let engagementScore = 0;
  const hasRecentActivity = place.user_ratings_total > 0;
  const hasBusinessInfo = !!(place.formatted_phone_number || place.website);
  const hasOperatingHours = !!place.opening_hours;
  
  if (hasRecentActivity) engagementScore += 40;
  if (hasBusinessInfo) engagementScore += 30;
  if (hasOperatingHours) engagementScore += 30;

  // Photos & Media Score (15% weight)
  let photosScore = 0;
  if (place.photos && place.photos.length > 0) {
    // Enhanced photo scoring based on quantity and variety
    const photoCount = place.photos.length;
    photosScore = Math.round(Math.min((photoCount / 15) * 100, 100));
    
    // Bonus for having sufficient photos
    if (photoCount >= 10) photosScore = Math.round(Math.min(photosScore + 10, 100));
  }

  // Profile Completeness Score (15% weight)
  let completenessScore = 0;
  const fields = [
    place.name,
    place.formatted_address,
    place.formatted_phone_number,
    place.website,
    place.opening_hours,
    place.photos && place.photos.length > 0
  ];
  
  const completedFields = fields.filter(field => !!field).length;
  completenessScore = Math.round((completedFields / fields.length) * 100);

  // Calculate weighted overall score
  const overall = Math.round(
    (reviewsScore * 0.30) + 
    (engagementScore * 0.25) + 
    (photosScore * 0.15) + 
    (completenessScore * 0.15) + 
    (15) // Base score
  );

  return {
    overall: Math.min(overall, 100),
    reviews: reviewsScore,
    engagement: engagementScore,
    photos: photosScore,
    completeness: completenessScore
  };
}

function generateAnalysis(scores: any, place: GooglePlaceDetails) {
  const issues = [];
  const strengths = [];

  if (scores.reviews < 70) {
    issues.push("Low review volume or rating affecting customer trust");
  } else {
    strengths.push("Strong review performance building customer confidence");
  }

  if (scores.engagement < 60) {
    issues.push("Limited customer engagement and interaction");
  } else {
    strengths.push("Good customer engagement levels");
  }

  if (scores.photos < 50) {
    issues.push("Insufficient visual content to attract customers");
  } else {
    strengths.push("Good visual representation of your business");
  }

  if (scores.completeness < 80) {
    issues.push("Incomplete business profile missing key information");
  } else {
    strengths.push("Well-completed business profile");
  }

  return { issues, strengths };
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to calculate name similarity using Levenshtein distance
function calculateNameSimilarity(str1: string, str2: string): number {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - (matrix[len2][len1] / maxLen);
}

serve(handler);