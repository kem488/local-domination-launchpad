import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

export const PricingCountdown = () => {
  return (
    <div className="flex justify-center mb-12">
      <Card className="p-6 bg-gradient-to-r from-brand-orange/10 to-primary/10 border-brand-orange/20">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-brand-orange">
            <Clock className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Limited Consultation Spots Available</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">This Week</span>
              </div>
              <div className="text-2xl font-bold text-primary">3 Spots</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Response Time</span>
              </div>
              <div className="text-2xl font-bold text-success">24hrs</div>
              <div className="text-sm text-muted-foreground">Or Less</div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Book your free consultation now to secure your spot this week
          </p>
        </div>
      </Card>
    </div>
  );
};