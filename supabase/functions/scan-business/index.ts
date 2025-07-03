import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Starting scan for: ${businessName} in ${businessLocation}`);

    // Search for the business using Google Places Text Search
    const searchQuery = `${businessName} ${businessLocation}`;
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${googleApiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      throw new Error('Business not found on Google');
    }

    const place = searchData.results[0];
    
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
    photosScore = Math.min((place.photos.length / 10) * 100, 100);
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

serve(handler);