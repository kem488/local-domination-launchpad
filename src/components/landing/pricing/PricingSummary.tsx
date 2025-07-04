import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PricingSummaryProps {
  savings: {
    lockedRate: number;
    regularRate: number;
    yearlySavings: number;
    monthlySavings: number;
  };
}

export const PricingSummary = ({ savings }: PricingSummaryProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-8">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Regular Price</div>
              <div className="text-2xl font-bold line-through text-muted-foreground">£247/month</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Your Locked Rate</div>
              <div className="text-3xl font-bold text-success">£97/month</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Annual Savings</div>
              <div className="text-2xl font-bold text-brand-orange">£{savings.yearlySavings.toLocaleString()}</div>
            </div>
          </div>

          <div className="p-4 bg-brand-blue-light rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-brand-blue">Why this rate?</strong> We're building case studies across UK trades. Rate locks forever - even if we increase to £300-400+.
            </p>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className="btn-hover-effect"
            onClick={() => {
              const scanSection = document.getElementById('business-scan');
              if (scanSection) {
                scanSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get My Free Business Scan First
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};