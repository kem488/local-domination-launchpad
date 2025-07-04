import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resendApiKey) {
      throw new Error("Resend API key not configured");
    }

    const { type, clientId, recipientEmail, businessName, accessUrl } = await req.json();

    let subject = '';
    let htmlContent = '';

    if (type === 'welcome') {
      subject = `Welcome to Syngularity Labs - Google Business Profile Setup for ${businessName}`;
      htmlContent = `
        <h1>Welcome to Syngularity Labs!</h1>
        <p>Thank you for choosing us to optimize your Google Business Profile for <strong>${businessName}</strong>.</p>
        
        <h2>Next Steps:</h2>
        <ol>
          <li>We'll be setting up your Google Business Profile optimization</li>
          <li>You'll receive regular updates on your progress</li>
          <li>Our AI-powered system will start working on improving your online presence</li>
        </ol>

        <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
        
        <p>Best regards,<br>
        The Syngularity Labs Team</p>
      `;
    } else if (type === 'follow_up') {
      subject = `Follow-up: Google Business Profile Access for ${businessName}`;
      htmlContent = `
        <h1>Follow-up: Google Business Profile Access</h1>
        <p>We're following up on your Google Business Profile setup for <strong>${businessName}</strong>.</p>
        
        <p>To continue with your optimization, we need access to your Google Business Profile.</p>
        
        <p>Please visit your Google Business Profile at: <a href="https://business.google.com/manage">business.google.com/manage</a></p>
        
        <p>If you need assistance, please reply to this email and we'll help you through the process.</p>
        
        <p>Best regards,<br>
        The Syngularity Labs Team</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Syngularity Labs <noreply@syngularity-labs.com>", // You'll need to update this with your verified domain
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log(`${type} email sent successfully:`, emailResponse);

    return new Response(JSON.stringify({
      success: true,
      emailId: emailResponse.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error sending email:', errorMessage);
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});