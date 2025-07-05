import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const { scanId, businessData, scanResults, placeDetails } = await req.json();
    
    if (!scanId) {
      throw new Error("Scan ID is required");
    }

    console.log(`Generating AI recommendations for scan: ${scanId}`);
    
    const prompt = `As a Google Business Profile optimization expert, analyze this UK business profile and provide specific actionable recommendations:

Business: ${businessData.businessName}
Location: ${businessData.businessLocation}

Current Profile Performance:
- Overall Score: ${scanResults.overallScore}/100
- Reviews Score: ${scanResults.reviewsScore}/100
- Completeness Score: ${scanResults.completenessScore}/100
- Photos Score: ${scanResults.photosScore}/100
- Engagement Score: ${scanResults.engagementScore}/100

Business Profile Details:
- Rating: ${placeDetails.rating}/5 (${placeDetails.reviewCount} reviews)
- Has Photos: ${placeDetails.hasPhotos}
- Has Website: ${placeDetails.hasWebsite}
- Has Phone: ${placeDetails.hasPhone}

Provide recommendations in this exact JSON format:
{
  "priority": "critical|high|medium",
  "quickWins": ["action 1", "action 2", "action 3"],
  "recommendations": [
    {
      "category": "Profile Optimization",
      "action": "specific action to take",
      "impact": "expected result and benefit",
      "timeframe": "1-2 weeks",
      "difficulty": "easy|medium|hard"
    }
  ],
  "profileGaps": "explanation of what's missing from their Google Business Profile",
  "revenueImpact": "estimated business impact and revenue potential"
}

Focus on the lowest scoring areas first. Provide 4-6 specific, actionable recommendations.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a Google Business Profile optimization expert helping UK tradespeople and service businesses improve their online presence. Focus on profile completeness, optimization opportunities, and actionable improvements. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    let recommendations;
    
    try {
      const aiContent = aiResponse.choices[0].message.content;
      // Clean up the response in case it contains markdown formatting
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recommendations = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback recommendations
        recommendations = {
          priority: scanResults.overallScore < 50 ? "critical" : scanResults.overallScore < 70 ? "high" : "medium",
          quickWins: [
            "Add high-quality photos of your work",
            "Respond to recent customer reviews",
            "Update business hours and contact information"
          ],
          recommendations: [
            {
              category: "Profile Optimization",
              action: "Complete all missing profile information fields",
              impact: "Increase profile completeness and local search visibility",
              timeframe: "2-4 weeks",
              difficulty: "easy"
            }
          ],
          profileGaps: "Your Google Business Profile is missing key information that customers look for when choosing a service provider",
          revenueImpact: "Optimizing your profile could increase leads by 25-40% within 3 months"
        };
    }

    // Save recommendations to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: updateError } = await supabase
      .from('business_scans')
      .update({
        ai_recommendations: JSON.stringify(recommendations)
      })
      .eq('id', scanId);

    if (updateError) {
      console.error('Failed to save recommendations to database:', updateError);
      throw updateError;
    }

    console.log(`AI recommendations saved successfully for scan: ${scanId}`);

    return new Response(JSON.stringify({
      success: true,
      recommendations: recommendations
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error generating recommendations:', errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      recommendations: "We're having trouble generating recommendations right now. Please try again later."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});