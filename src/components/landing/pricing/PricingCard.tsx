import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { TrialPopup } from "../TrialPopup";
import { trackConversion } from "@/hooks/useABTesting";

interface PricingCardProps {
  savings: {
    lockedRate: number;
    regularRate: number;
    yearlySavings: number;
    monthlySavings: number;
  };
}

const features = [
  "Complete 6-Phase System Implementation",
  "AI-Powered Review Automation Platform", 
  "Google Business Profile Optimization",
  "Automated Customer Follow-up Sequences",
  "Reputation Monitoring Dashboard",
  "Professional Review Response Templates",
  "Local SEO Optimization Package",
  "Citation Building & Management",
  "90-Day Performance Guarantee",
  "Lifetime Access & Updates",
  "Priority Email Support",
  "Monthly Strategy Calls (First 6 Months)"
];

export const PricingCard = ({ savings }: PricingCardProps) => {
  const handlePricingCTA = (action: string) => {
    trackConversion('pricing_cta_click', 'pricing', { action });
  };

  return (
    <Card className="relative border-primary/50 shadow-lg">
      <CardHeader className="text-center">
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
          LIMITED TIME ONLY
        </Badge>
        <CardTitle className="text-3xl mt-4">Free Trial + Locked Rate</CardTitle>
        <div className="text-center py-4">
          <div className="text-2xl font-bold text-success mb-2">14 Days FREE</div>
          <div className="text-5xl font-bold text-primary">£97<span className="text-lg">/month</span></div>
          <div className="text-muted-foreground line-through text-xl">£247/month</div>
          <div className="text-success font-semibold">Save £{savings.monthlySavings}/month (£{savings.yearlySavings.toLocaleString()}/year)</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        <TrialPopup>
          <Button 
            size="lg" 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground text-lg py-4 btn-hover-effect"
            onClick={() => handlePricingCTA('trial_signup')}
            id="pricing-primary-cta"
          >
            Start Free Trial & Lock Rate
          </Button>
        </TrialPopup>
        
        <div className="text-center mt-4 text-sm text-muted-foreground">
          <p>✓ 90-Day Money-Back Guarantee</p>
          <p>✓ Secure Payment Processing</p>
          <p>✓ Instant Access After Payment</p>
        </div>
      </CardContent>
    </Card>
  );
};