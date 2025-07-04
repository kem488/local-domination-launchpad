import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    const { businessData, scanResults } = await req.json();
    
    const prompt = `Based on this business scan data, provide 3-5 specific, actionable recommendations to improve their Google Business Profile presence and local SEO:

Business: ${businessData.businessName}
Location: ${businessData.businessLocation}

Current Status:
- Overall Score: ${scanResults.overallScore}/100
- Reviews Score: ${scanResults.reviewsScore}/100
- Completeness Score: ${scanResults.completenessScore}/100
- Photo Score: ${scanResults.photosScore}/100

Provide specific, actionable recommendations in this format:
1. [Priority: High/Medium/Low] - [Specific Action] - [Expected Impact]
2. [Priority: High/Medium/Low] - [Specific Action] - [Expected Impact]
etc.

Focus on the lowest scoring areas first. Keep recommendations practical and specific to local service businesses.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a local SEO expert specializing in Google Business Profile optimization for UK tradespeople and service businesses.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const recommendations = aiResponse.choices[0].message.content;

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