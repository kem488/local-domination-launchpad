import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Building, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AgencySettings {
  company_name: string;
  agency_email: string;
  organization_id: string;
}

interface ClientData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  address: string;
  postcode: string;
}

export const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [agencySettings, setAgencySettings] = useState<AgencySettings>({
    company_name: "",
    agency_email: "",
    organization_id: ""
  });

  const [clientData, setClientData] = useState<ClientData>({
    business_name: "",
    owner_name: "",
    owner_email: "",
    phone: "",
    address: "",
    postcode: ""
  });

  const handleAgencySubmit = async () => {
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

      const { error } = await supabase
        .from('agency_settings')
        .upsert({
          user_id: user.id,
          company_name: agencySettings.company_name,
          agency_email: agencySettings.agency_email,
          organization_id: agencySettings.organization_id
        });

      if (error) throw error;

      toast({
        title: "Agency settings saved",
        description: "Moving to client information step"
      });
      setCurrentStep(2);
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
          agencyEmail: agencySettings.agency_email
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

      toast({
        title: "Client onboarded successfully!",
        description: "Access request sent and welcome email delivered"
      });
      
      setCurrentStep(3);
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

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Agency Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={agencySettings.company_name}
            onChange={(e) => setAgencySettings(prev => ({ ...prev, company_name: e.target.value }))}
            placeholder="Your agency name"
            required
          />
        </div>
        <div>
          <Label htmlFor="agency_email">Agency Email</Label>
          <Input
            id="agency_email"
            type="email"
            value={agencySettings.agency_email}
            onChange={(e) => setAgencySettings(prev => ({ ...prev, agency_email: e.target.value }))}
            placeholder="agency@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="organization_id">Organization ID (Optional)</Label>
          <Input
            id="organization_id"
            value={agencySettings.organization_id}
            onChange={(e) => setAgencySettings(prev => ({ ...prev, organization_id: e.target.value }))}
            placeholder="Your Google organization ID"
          />
        </div>
        <Button 
          onClick={handleAgencySubmit} 
          disabled={!agencySettings.company_name || !agencySettings.agency_email || loading}
          className="w-full"
        >
          Continue to Client Information
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input
              id="business_name"
              value={clientData.business_name}
              onChange={(e) => setClientData(prev => ({ ...prev, business_name: e.target.value }))}
              placeholder="ABC Plumbing Ltd"
              required
            />
          </div>
          <div>
            <Label htmlFor="owner_name">Owner Name</Label>
            <Input
              id="owner_name"
              value={clientData.owner_name}
              onChange={(e) => setClientData(prev => ({ ...prev, owner_name: e.target.value }))}
              placeholder="John Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="owner_email">Owner Email</Label>
            <Input
              id="owner_email"
              type="email"
              value={clientData.owner_email}
              onChange={(e) => setClientData(prev => ({ ...prev, owner_email: e.target.value }))}
              placeholder="john@abcplumbing.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={clientData.phone}
              onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="07xxx xxx xxx"
            />
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              value={clientData.address}
              onChange={(e) => setClientData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="123 High Street, London"
            />
          </div>
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={clientData.postcode}
              onChange={(e) => setClientData(prev => ({ ...prev, postcode: e.target.value }))}
              placeholder="SW1A 1AA"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(1)}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button 
            onClick={handleClientSubmit}
            disabled={!clientData.business_name || !clientData.owner_name || !clientData.owner_email || loading}
            className="flex-1"
          >
            Generate Access Request
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Onboarding Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <Badge className="bg-success text-success-foreground">
          Google Business Profile Access Request Sent
        </Badge>
        <p className="text-muted-foreground">
          We've sent an access request email to {clientData.owner_email} and will follow up automatically.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => navigate('/dashboard')} className="flex-1">
            Go to Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentStep(2);
              setClientData({
                business_name: "",
                owner_name: "",
                owner_email: "",
                phone: "",
                address: "",
                postcode: ""
              });
            }}
            className="flex-1"
          >
            Add Another Client
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Onboarding</h1>
          <p className="text-muted-foreground">Set up Google Business Profile access for your clients</p>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-px mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </div>
  );
};