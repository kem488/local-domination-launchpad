import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface ClientData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone: string;
  address: string;
  postcode: string;
}

interface OnboardingSuccessProps {
  clientData: any;
}

export const OnboardingSuccess = ({ clientData }: OnboardingSuccessProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          Onboarding Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <Badge className="bg-success text-success-foreground">
          Google Business Profile Access Request Sent
        </Badge>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Client Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Business:</strong> {clientData.business_name}</p>
              <p><strong>Owner:</strong> {clientData.owner_name}</p>
              <p><strong>Email:</strong> {clientData.owner_email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We've sent an access request email to {clientData.owner_email} and will follow up automatically.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Next steps:</strong> Check your email for the Google Business Profile access request, then we'll begin optimization within 24-48 hours.
            </p>
          </div>
        </div>
        
        <Button onClick={() => navigate('/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};