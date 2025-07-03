import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AGENCY_CONFIG } from "@/lib/constants";
import { ClientInfoForm } from "@/components/onboarding/ClientInfoForm";
import { OnboardingSuccess } from "@/components/onboarding/OnboardingSuccess";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

interface ClientData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  address: string;
  postcode: string;
}

export const Onboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [clientData, setClientData] = useState<ClientData>({
    business_name: "",
    owner_name: "",
    owner_email: "",
    phone: "",
    address: "",
    postcode: ""
  });

  const handleClientSubmit = async () => {
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

      // Create client onboarding record
      const { data: clientRecord, error: clientError } = await supabase
        .from('client_onboarding')
        .insert({
          user_id: user.id,
          business_name: clientData.business_name,
          owner_name: clientData.owner_name,
          owner_email: clientData.owner_email,
          phone: clientData.phone,
          address: clientData.address,
          postcode: clientData.postcode,
          status: 'pending'
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Generate GBP access request
      const { data, error: functionError } = await supabase.functions.invoke('generate-gbp-access-link', {
        body: {
          clientId: clientRecord.id,
          businessName: clientData.business_name,
          ownerEmail: clientData.owner_email,
          agencyEmail: AGENCY_CONFIG.agencyEmail
        }
      });

      if (functionError) throw functionError;

      // Send welcome email
      await supabase.functions.invoke('send-gbp-email', {
        body: {
          type: 'welcome',
          clientId: clientRecord.id,
          recipientEmail: clientData.owner_email,
          businessName: clientData.business_name,
          accessUrl: data.accessUrl
        }
      });

      // Send data to Make.com webhook
      await supabase.functions.invoke('send-to-make-webhook', {
        body: {
          event_type: 'client_onboarding',
          timestamp: new Date().toISOString(),
          client_id: clientRecord.id,
          business_data: {
            business_name: clientData.business_name,
            owner_name: clientData.owner_name,
            owner_email: clientData.owner_email,
            phone: clientData.phone,
            address: clientData.address,
            postcode: clientData.postcode
          },
          status_data: {
            onboarding_status: 'complete',
            gbp_status: 'sent',
            last_follow_up: null
          },
          agency_data: {
            user_id: user.id,
            agency_email: AGENCY_CONFIG.agencyEmail
          }
        }
      });

      toast({
        title: "Client onboarded successfully!",
        description: "Access request sent and welcome email delivered"
      });
      
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error creating client",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setCurrentStep(1);
    setClientData({
      business_name: "",
      owner_name: "",
      owner_email: "",
      phone: "",
      address: "",
      postcode: ""
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Onboarding</h1>
          <p className="text-muted-foreground">Set up Google Business Profile access for your clients</p>
          
          <OnboardingProgress currentStep={currentStep} totalSteps={2} />
        </div>

        {currentStep === 1 && (
          <ClientInfoForm 
            clientData={clientData}
            onClientDataChange={setClientData}
            onSubmit={handleClientSubmit}
            loading={loading}
          />
        )}
        {currentStep === 2 && (
          <OnboardingSuccess 
            clientData={clientData}
            onAddAnother={handleAddAnother}
          />
        )}
      </div>
    </div>
  );
};