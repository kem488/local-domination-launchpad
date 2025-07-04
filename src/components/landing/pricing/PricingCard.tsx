import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Phone, Mail } from "lucide-react";
import { ConsultationPopup } from "../ConsultationPopup";
import { trackConversion } from "@/hooks/useABTesting";

const services = [
  "Complete Business Analysis & Action Plan",
  "Google Business Profile Optimization", 
  "AI-Powered Review Management Strategy",
  "Local SEO & Online Visibility Improvement",
  "Professional Citation Building",
  "Reputation Monitoring & Management",
  "Customer Follow-up System Design",
  "Competitor Analysis & Market Positioning",
  "Performance Tracking & Reporting",
  "Ongoing Support & Consultation",
  "Priority Response Times",
  "Custom Solutions for Your Trade"
];

export const PricingCard = () => {
  const handlePricingCTA = (action: string) => {
    trackConversion('pricing_cta_click', 'pricing', { action });
  };

  return (
    <Card className="relative border-primary/50 shadow-lg">
      <CardHeader className="text-center">
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-orange text-brand-orange-foreground">
          TAILORED SOLUTIONS
        </Badge>
        <CardTitle className="text-3xl mt-4">Professional Services</CardTitle>
        <div className="text-center py-4">
          <div className="text-5xl font-bold text-primary">Custom</div>
          <div className="text-xl text-muted-foreground">Pricing Based on Your Needs</div>
          <div className="text-success font-semibold mt-2">Free Consultation & Business Analysis</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-8">
          {services.map((service, index) => (
            <div key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{service}</span>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <ConsultationPopup>
            <Button 
              size="lg" 
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-brand-orange-foreground text-lg py-4 btn-hover-effect"
              onClick={() => handlePricingCTA('consultation_request')}
              id="pricing-primary-cta"
            >
              <Phone className="h-5 w-5 mr-2" />
              Request Free Consultation
            </Button>
          </ConsultationPopup>
          
          <Button 
            variant="outline"
            size="lg" 
            className="w-full text-lg py-4"
            onClick={() => {
              handlePricingCTA('email_contact');
              window.location.href = 'mailto:support@syngularitylabs.com?subject=Business Growth Consultation';
            }}
          >
            <Mail className="h-5 w-5 mr-2" />
            Email Us Directly
          </Button>
        </div>
        
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>✓ Free Business Analysis & Strategy Session</p>
          <p>✓ No Obligation Consultation</p>
          <p>✓ Tailored Solutions for Your Trade</p>
        </div>
      </CardContent>
    </Card>
  );
};