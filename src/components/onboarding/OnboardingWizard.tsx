import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AGENCY_CONFIG } from "@/lib/constants";
import { OnboardingWizardProgress } from "./OnboardingWizardProgress";
import { OnboardingSuccess } from "./OnboardingSuccess";

// Import all wizard steps
import { Step1BusinessBasics } from "./wizard-steps/Step1BusinessBasics";
import { Step2LocationContact } from "./wizard-steps/Step2LocationContact";
import { Step3GoalsMarketing } from "./wizard-steps/Step3GoalsMarketing";
import { Step4GoogleBusiness } from "./wizard-steps/Step4GoogleBusiness";
import { Step5AIResponses } from "./wizard-steps/Step5AIResponses";
import { Step6TeamContact } from "./wizard-steps/Step6TeamContact";
import { Step7ReviewSubmit } from "./wizard-steps/Step7ReviewSubmit";

interface WizardData {
  // Basic business info
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  website_url: string;
  industry: string;
  services_offered: string[];
  target_audience: string;
  team_size: number;
  
  // Location & contact
  address: string;
  postcode: string;
  business_hours: any;
  social_media_links: any;
  
  // Goals & marketing
  primary_goals: string[];
  pain_points: string[];
  current_marketing_methods: string[];
  marketing_budget_range: string;
  
  // Google Business Profile
  has_existing_gbp: boolean;
  existing_gbp_url: string;
  previous_agency_experience: string;
  
  // AI Response settings
  ai_responses_enabled: boolean;
  personality_style: string;
  response_delay_hours: number;
  escalation_keywords: string[];
  auto_approve_positive: boolean;
  auto_approve_neutral: boolean;
  auto_approve_negative: boolean;
  
  // Team & contact preferences
  team_members: any[];
  preferred_contact_method: string;
  annual_revenue_range: string;
  
  // Wizard state
  onboarding_step: number;
  wizard_completed: boolean;
  wizard_data: any;
}

export const OnboardingWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [wizardData, setWizardData] = useState<Partial<WizardData>>({
    business_name: "",
    owner_name: "",
    owner_email: "",
    phone: "",
    website_url: "",
    industry: "",
    services_offered: [],
    target_audience: "",
    team_size: 1,
    address: "",
    postcode: "",
    business_hours: {},
    social_media_links: {},
    primary_goals: [],
    pain_points: [],
    current_marketing_methods: [],
    marketing_budget_range: "",
    has_existing_gbp: false,
    existing_gbp_url: "",
    previous_agency_experience: "",
    ai_responses_enabled: true,
    personality_style: "professional",
    response_delay_hours: 2,
    escalation_keywords: [],
    auto_approve_positive: true,
    auto_approve_neutral: false,
    auto_approve_negative: false,
    team_members: [],
    preferred_contact_method: "email",
    annual_revenue_range: "",
    onboarding_step: 1,
    wizard_completed: false,
    wizard_data: {}
  });

  // Auto-save functionality
  useEffect(() => {
    const saveProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Save to localStorage as backup
        localStorage.setItem('onboarding_wizard_data', JSON.stringify({
          ...wizardData,
          currentStep,
          lastSaved: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };

    const debounceTimer = setTimeout(saveProgress, 1000);
    return () => clearTimeout(debounceTimer);
  }, [wizardData, currentStep]);

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = () => {
      try {
        const saved = localStorage.getItem('onboarding_wizard_data');
        if (saved) {
          const parsedData = JSON.parse(saved);
          setWizardData(parsedData);
          setCurrentStep(parsedData.currentStep || 1);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    };

    loadSavedProgress();
  }, []);

  const handleDataChange = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to continue",
          variant: "destructive"
        });
        return;
      }

      // Create comprehensive client onboarding record
      const { data: clientRecord, error: clientError } = await supabase
        .from('client_onboarding')
        .insert({
          user_id: user.id,
          business_name: wizardData.business_name,
          owner_name: wizardData.owner_name,
          owner_email: wizardData.owner_email,
          phone: wizardData.phone,
          address: wizardData.address,
          postcode: wizardData.postcode,
          website_url: wizardData.website_url,
          industry: wizardData.industry,
          services_offered: wizardData.services_offered,
          target_audience: wizardData.target_audience,
          business_hours: wizardData.business_hours,
          social_media_links: wizardData.social_media_links,
          current_marketing_methods: wizardData.current_marketing_methods,
          marketing_budget_range: wizardData.marketing_budget_range,
          primary_goals: wizardData.primary_goals,
          pain_points: wizardData.pain_points,
          has_existing_gbp: wizardData.has_existing_gbp,
          existing_gbp_url: wizardData.existing_gbp_url,
          previous_agency_experience: wizardData.previous_agency_experience,
          team_size: wizardData.team_size,
          annual_revenue_range: wizardData.annual_revenue_range,
          preferred_contact_method: wizardData.preferred_contact_method,
          onboarding_step: 7,
          wizard_completed: true,
          wizard_data: wizardData,
          status: 'pending'
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create team members if any
      if (wizardData.team_members && wizardData.team_members.length > 0) {
        const teamMemberInserts = wizardData.team_members.map(member => ({
          client_id: clientRecord.id,
          name: member.name,
          role: member.role,
          email: member.email,
          phone: member.phone,
          is_primary_contact: member.is_primary_contact
        }));

        await supabase.from('client_team_members').insert(teamMemberInserts);
      }

      // Create AI response settings
      await supabase.from('client_review_settings').insert({
        client_id: clientRecord.id,
        ai_responses_enabled: wizardData.ai_responses_enabled,
        personality_style: wizardData.personality_style,
        response_delay_hours: wizardData.response_delay_hours,
        escalation_keywords: wizardData.escalation_keywords,
        auto_approve_positive: wizardData.auto_approve_positive,
        auto_approve_neutral: wizardData.auto_approve_neutral,
        auto_approve_negative: wizardData.auto_approve_negative
      });

      // Generate GBP access request
      const { data: gbpData, error: functionError } = await supabase.functions.invoke('generate-gbp-access-link', {
        body: {
          clientId: clientRecord.id,
          businessName: wizardData.business_name,
          ownerEmail: wizardData.owner_email,
          agencyEmail: AGENCY_CONFIG.agencyEmail
        }
      });

      if (functionError) throw functionError;

      // Send welcome email
      await supabase.functions.invoke('send-gbp-email', {
        body: {
          type: 'welcome',
          clientId: clientRecord.id,
          recipientEmail: wizardData.owner_email,
          businessName: wizardData.business_name,
          accessUrl: gbpData.accessUrl
        }
      });

      // Send comprehensive data to Make.com webhook
      await supabase.functions.invoke('send-to-make-webhook', {
        body: {
          event_type: 'client_onboarding',
          timestamp: new Date().toISOString(),
          client_id: clientRecord.id,
          business_data: {
            business_name: wizardData.business_name,
            owner_name: wizardData.owner_name,
            owner_email: wizardData.owner_email,
            phone: wizardData.phone,
            address: wizardData.address,
            postcode: wizardData.postcode
          },
          status_data: {
            onboarding_status: 'complete',
            gbp_status: 'sent',
            last_follow_up: null
          },
          agency_data: {
            user_id: user.id,
            agency_email: AGENCY_CONFIG.agencyEmail
          },
          extended_data: wizardData // Include all wizard data
        }
      });

      // Clear saved progress
      localStorage.removeItem('onboarding_wizard_data');

      toast({
        title: "Onboarding completed successfully!",
        description: "Access request sent and welcome email delivered"
      });
      
      setCompleted(true);
    } catch (error: any) {
      toast({
        title: "Error completing onboarding",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setCompleted(false);
    setCurrentStep(1);
    setCompletedSteps([]);
    setWizardData({
      business_name: "",
      owner_name: "",
      owner_email: "",
      phone: "",
      website_url: "",
      industry: "",
      services_offered: [],
      target_audience: "",
      team_size: 1,
      address: "",
      postcode: "",
      business_hours: {},
      social_media_links: {},
      primary_goals: [],
      pain_points: [],
      current_marketing_methods: [],
      marketing_budget_range: "",
      has_existing_gbp: false,
      existing_gbp_url: "",
      previous_agency_experience: "",
      ai_responses_enabled: true,
      personality_style: "professional",
      response_delay_hours: 2,
      escalation_keywords: [],
      auto_approve_positive: true,
      auto_approve_neutral: false,
      auto_approve_negative: false,
      team_members: [],
      preferred_contact_method: "email",
      annual_revenue_range: "",
      onboarding_step: 1,
      wizard_completed: false,
      wizard_data: {}
    });
  };

  if (completed) {
    return (
      <OnboardingSuccess 
        clientData={wizardData}
        onAddAnother={handleAddAnother}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Comprehensive Client Onboarding</h1>
          <p className="text-muted-foreground">Complete setup for Google Business Profile management and AI-powered review responses</p>
        </div>

        <OnboardingWizardProgress 
          currentStep={currentStep} 
          totalSteps={7}
          completedSteps={completedSteps}
        />

        {currentStep === 1 && (
          <Step1BusinessBasics
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <Step2LocationContact
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 3 && (
          <Step3GoalsMarketing
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 4 && (
          <Step4GoogleBusiness
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 5 && (
          <Step5AIResponses
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 6 && (
          <Step6TeamContact
            data={wizardData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === 7 && (
          <Step7ReviewSubmit
            data={wizardData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};