import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationRequest {
  scanId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scanId }: RecommendationRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get scan data
    const { data: scanData, error: scanError } = await supabase
      .from('business_scans')
      .select('*')
      .eq('id', scanId)
      .single();

    if (scanError || !scanData) {
      throw new Error('Scan not found');
    }

    const { scores, placeDetails, analysis } = scanData.scan_results;

    // Generate AI recommendations using OpenAI
    const prompt = `As a Google Business Profile optimization expert, analyze this UK business and provide specific, actionable recommendations:

Business: ${scanData.business_name}
Location: ${scanData.business_location}
Current Scores:
- Overall: ${scores.overall}/100
- Reviews: ${scores.reviews}/100
- Engagement: ${scores.engagement}/100
- Photos: ${scores.photos}/100
- Completeness: ${scores.completeness}/100

Business Details:
- Rating: ${placeDetails.rating}/5 (${placeDetails.user_ratings_total} reviews)
- Has Website: ${placeDetails.hasWebsite ? 'Yes' : 'No'}
- Has Phone: ${placeDetails.hasPhone ? 'Yes' : 'No'}
- Has Photos: ${placeDetails.hasPhotos ? 'Yes' : 'No'}
- Has Hours: ${placeDetails.hasHours ? 'Yes' : 'No'}

Provide recommendations in this JSON format:
{
  "priority": "critical|high|medium",
  "recommendations": [
    {
      "category": "Reviews & Rating|Customer Engagement|Photos & Media|Profile Completeness",
      "action": "specific action to take",
      "impact": "expected business impact",
      "timeframe": "1-2 weeks|1 month|2-3 months",
      "difficulty": "easy|medium|hard"
    }
  ],
  "quickWins": ["immediate actions they can take today"],
  "competitiveRisk": "explanation of what happens if they don't act",
  "revenueImpact": "estimated impact on customer acquisition"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert in Google Business Profile optimization for UK businesses. Provide specific, actionable recommendations based on the data provided.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    let recommendations;
    
    try {
      recommendations = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      recommendations = generateFallbackRecommendations(scores, placeDetails);
    }

    // Update scan with AI recommendations
    const { error: updateError } = await supabase
      .from('business_scans')
      .update({ 
        ai_recommendations: JSON.stringify(recommendations),
        lead_qualified: scores.overall < 75 // Qualify leads with lower scores
      })
      .eq('id', scanId);

    if (updateError) {
      console.error('Error updating scan:', updateError);
    }

    console.log(`Generated recommendations for scan ${scanId}`);

    return new Response(JSON.stringify({
      success: true,
      recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in generate-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate recommendations' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

function generateFallbackRecommendations(scores: any, placeDetails: any) {
  const recommendations = [];
  let priority = "medium";

  if (scores.overall < 50) priority = "critical";
  else if (scores.overall < 75) priority = "high";

  if (scores.reviews < 70) {
    recommendations.push({
      category: "Reviews & Rating",
      action: "Implement a systematic review collection process with follow-up emails and SMS",
      impact: "Increase customer trust and local search rankings",
      timeframe: "2-3 months",
      difficulty: "medium"
    });
  }

  if (scores.engagement < 60) {
    recommendations.push({
      category: "Customer Engagement",
      action: "Add business hours, contact information, and respond to all customer inquiries",
      impact: "Improve customer accessibility and engagement signals",
      timeframe: "1-2 weeks",
      difficulty: "easy"
    });
  }

  if (scores.photos < 50) {
    recommendations.push({
      category: "Photos & Media",
      action: "Upload 10-15 high-quality photos showcasing products, services, and premises",
      impact: "Increase profile views and customer engagement",
      timeframe: "1 week",
      difficulty: "easy"
    });
  }

  return {
    priority,
    recommendations,
    quickWins: ["Add business hours", "Upload 5 photos", "Update contact information"],
    competitiveRisk: "Competitors with better profiles are capturing your potential customers",
    revenueImpact: "Could increase customer inquiries by 25-40% within 3 months"
  };
}

serve(handler);