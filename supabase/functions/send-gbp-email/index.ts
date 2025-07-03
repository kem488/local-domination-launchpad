import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'welcome' | 'follow_up' | 'access_granted' | 'access_denied';
  clientId: string;
  recipientEmail: string;
  businessName: string;
  accessUrl?: string;
}

// Hardcoded agency configuration
const AGENCY_CONFIG = {
  organizationId: "256083320097",
  agencyEmail: "admin@gudmedia.co.uk",
  companyName: "GUD Media",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { type, clientId, recipientEmail, businessName, accessUrl }: EmailRequest = await req.json();

    console.log('Sending email:', { type, clientId, recipientEmail, businessName });

    // Get email templates based on type
    const getEmailContent = (type: string) => {
      switch (type) {
        case 'welcome':
          return {
            subject: `Welcome! Google Business Profile Setup for ${businessName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to Google Business Profile Setup</h2>
                <p>Hi there,</p>
                <p>We're excited to help you set up your Google Business Profile for <strong>${businessName}</strong>!</p>
                <p>To get started, please click the link below to create or claim your business listing:</p>
                <a href="${accessUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                  Set Up Google Business Profile
                </a>
                <p>If you have any questions, please don't hesitate to contact us at ${AGENCY_CONFIG.agencyEmail}</p>
                <p>Best regards,<br>The ${AGENCY_CONFIG.companyName} Team</p>
              </div>
            `
          };
        case 'follow_up':
          return {
            subject: `Reminder: Complete your Google Business Profile setup for ${businessName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">Gentle Reminder</h2>
                <p>Hi there,</p>
                <p>We noticed you haven't completed the Google Business Profile setup for <strong>${businessName}</strong> yet.</p>
                <p>Setting up your profile is crucial for:</p>
                <ul>
                  <li>Getting found by local customers</li>
                  <li>Managing your online reputation</li>
                  <li>Tracking customer engagement</li>
                </ul>
                <p>It only takes a few minutes to complete. Would you like to finish it now?</p>
                <p>Best regards,<br>Your Marketing Team</p>
              </div>
            `
          };
        case 'access_granted':
          return {
            subject: `Great news! Google Business Profile access granted for ${businessName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Access Granted! 🎉</h2>
                <p>Excellent news!</p>
                <p>We now have access to manage the Google Business Profile for <strong>${businessName}</strong>.</p>
                <p>What happens next:</p>
                <ul>
                  <li>We'll optimize your business information</li>
                  <li>Set up review management</li>
                  <li>Create engaging posts and updates</li>
                  <li>Monitor and improve your local SEO</li>
                </ul>
                <p>You should start seeing improvements in your local search visibility within the next few weeks.</p>
                <p>Best regards,<br>The ${AGENCY_CONFIG.companyName} Team</p>
              </div>
            `
          };
        default:
          return {
            subject: `Update regarding ${businessName}`,
            html: `<p>Thank you for your interest in our services.</p>`
          };
      }
    };

    const emailContent = getEmailContent(type);

    console.log('Sending real email via Resend:', {
      to: recipientEmail,
      subject: emailContent.subject
    });

    // Send actual email using Resend
    const emailResponse = await resend.emails.send({
      from: `${AGENCY_CONFIG.companyName} <onboarding@system.syngularitylabs.com>`,
      to: [recipientEmail],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email sent successfully via Resend:', emailResponse);

    // Create email sequence record
    const { data: emailRecord, error: emailError } = await supabase
      .from('email_sequences')
      .insert({
        client_id: clientId,
        sequence_type: type,
        status: 'sent',
        email_sent_at: new Date().toISOString()
      })
      .select()
      .single();

    if (emailError) {
      console.error('Error creating email sequence record:', emailError);
      throw emailError;
    }

    console.log('Email sequence record created:', emailRecord);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: emailRecord.id
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-gbp-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false 
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});