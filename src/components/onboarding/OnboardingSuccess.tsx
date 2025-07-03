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
  onAddAnother: () => void;
}

export const OnboardingSuccess = ({ clientData, onAddAnother }: OnboardingSuccessProps) => {
  const navigate = useNavigate();

  return (
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
            onClick={onAddAnother}
            className="flex-1"
          >
            Add Another Client
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};