import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { BusinessRecord } from "@/types/business";

interface GBPCardProps {
  business: BusinessRecord;
  onResendRequest: () => void;
}

export const GBPCard = ({ business, onResendRequest }: GBPCardProps) => {
  const gbpRequest = business.gbp_access_requests?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Google Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h5 className="text-sm font-medium mb-2">Access Status</h5>
          <StatusBadge status={gbpRequest?.status || 'pending'} />
        </div>
        
        {gbpRequest?.status === 'sent' && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              We've sent you an email to grant access to your Google Business Profile. 
              Please check your inbox and follow the instructions.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResendRequest}
            >
              <Mail className="h-4 w-4 mr-1" />
              Resend Request
            </Button>
          </div>
        )}
        
        {gbpRequest?.status === 'granted' && (
          <div className="p-3 bg-success/10 rounded-lg">
            <p className="text-sm text-success">
              Great! You've granted access to your Google Business Profile. 
              Our team will now begin optimizing your listing.
            </p>
          </div>
        )}
        
        {gbpRequest?.status === 'denied' && (
          <div className="p-3 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive mb-2">
              Access was denied. To proceed with optimization, please grant access to your profile.
            </p>
            <Button variant="outline" size="sm" onClick={onResendRequest}>
              <Mail className="h-4 w-4 mr-1" />
              Send New Request
            </Button>
          </div>
        )}
        
        {!gbpRequest && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Complete your business setup to request Google Business Profile access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};